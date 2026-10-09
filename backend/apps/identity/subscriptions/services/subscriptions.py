from datetime import timedelta

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.identity.subscriptions.models import (
    Subscription,
    SubscriptionPlan,
    SubscriptionRequest,
)


PENDING_REQUEST_STATUSES = [
    SubscriptionRequest.Status.PENDING,
    SubscriptionRequest.Status.PAYMENT_REPORTED,
]


@transaction.atomic
def assign_free_subscription(seller):
    """
    Give a seller a Free subscription if they don't already have one.
    Call this only after seller identity verification succeeds.
    """
    free_plan = SubscriptionPlan.objects.get(
        is_free=True,
        is_active=True,
    )

    subscription, created = Subscription.objects.get_or_create(
        seller=seller,
        defaults={
            "plan": free_plan,
            "status": Subscription.Status.ACTIVE,
            "current_period_end": None,
            "grace_ends_at": None,
        },
    )

    return subscription


@transaction.atomic
def create_subscription_request(
    subscription,
    requested_plan,
    payment_method,
):
    now = timezone.now()

    subscription = Subscription.objects.select_for_update().get(
        pk=subscription.pk
    )

    requested_plan = SubscriptionPlan.objects.get(
        pk=requested_plan.pk,
        is_active=True,
        is_free=False,
    )

    if subscription.plan.is_free is False:
        period_end = subscription.current_period_end

        if (
            subscription.status == Subscription.Status.ACTIVE
            and period_end
            and period_end > now
            and requested_plan.sort_order < subscription.plan.sort_order
        ):
            raise ValidationError(
                "You cannot downgrade while your paid subscription is active."
            )

    if SubscriptionRequest.objects.filter(
        subscription=subscription,
        status__in=PENDING_REQUEST_STATUSES,
    ).exists():
        raise ValidationError(
            "You already have a pending subscription request."
        )

    return SubscriptionRequest.objects.create(
        subscription=subscription,
        requested_plan=requested_plan,
        payment_method=payment_method,
    )


@transaction.atomic
def report_subscription_payment(subscription_request):
    subscription_request = (
        SubscriptionRequest.objects.select_for_update()
        .get(pk=subscription_request.pk)
    )

    if subscription_request.status != SubscriptionRequest.Status.PENDING:
        raise ValidationError(
            "Only a pending request can be marked as payment reported."
        )

    subscription_request.status = (
        SubscriptionRequest.Status.PAYMENT_REPORTED
    )
    subscription_request.payment_reported_at = timezone.now()
    subscription_request.save(
        update_fields=["status", "payment_reported_at"]
    )

    return subscription_request


@transaction.atomic
def approve_subscription_request(subscription_request, admin_user):
    """
    Call this only when an administrator has verified that the money
    was actually received.
    """
    subscription_request = (
        SubscriptionRequest.objects.select_for_update()
        .select_related("subscription", "requested_plan")
        .get(pk=subscription_request.pk)
    )

    if subscription_request.status not in PENDING_REQUEST_STATUSES:
        raise ValidationError("This request has already been processed.")

    subscription = Subscription.objects.select_for_update().get(
        pk=subscription_request.subscription_id
    )
    new_plan = subscription_request.requested_plan

    if not new_plan.is_active or new_plan.is_free:
        raise ValidationError("The requested paid plan is unavailable.")

    now = timezone.now()
    old_plan = subscription.plan

    # Never allow an active paid subscription to be downgraded.
    if (
        not old_plan.is_free
        and subscription.status == Subscription.Status.ACTIVE
        and subscription.current_period_end
        and subscription.current_period_end > now
        and new_plan.sort_order < old_plan.sort_order
    ):
        raise ValidationError(
            "A downgrade cannot be approved before the current period ends."
        )

    if not new_plan.duration_days:
        raise ValidationError("The paid plan has no valid duration.")

    # A renewal during the grace period uses the old expiration date
    # as the start of the new paid period.
    if (
        not old_plan.is_free
        and subscription.current_period_end
        and now <= (
            subscription.grace_ends_at
            or subscription.current_period_end
        )
        and subscription.current_period_end <= now
    ):
        period_start = subscription.current_period_end

    # Renewing the same plan before its expiration extends it from
    # the current period's end.
    elif (
        not old_plan.is_free
        and old_plan.pk == new_plan.pk
        and subscription.current_period_end
        and subscription.current_period_end > now
    ):
        period_start = subscription.current_period_end

    # A new paid subscription or an upgrade starts immediately.
    else:
        period_start = now

    subscription.plan = new_plan
    subscription.status = Subscription.Status.ACTIVE
    subscription.current_period_start = period_start
    subscription.current_period_end = (
        period_start + timedelta(days=new_plan.duration_days)
    )
    subscription.grace_ends_at = None
    subscription.save()

    subscription_request.status = SubscriptionRequest.Status.APPROVED
    subscription_request.decided_at = now
    subscription_request.decided_by = admin_user
    subscription_request.save(
        update_fields=["status", "decided_at", "decided_by"]
    )

    return subscription


@transaction.atomic
def reject_subscription_request(subscription_request, admin_user, note=""):
    subscription_request = (
        SubscriptionRequest.objects.select_for_update()
        .get(pk=subscription_request.pk)
    )

    if subscription_request.status not in PENDING_REQUEST_STATUSES:
        raise ValidationError("This request has already been processed.")

    subscription_request.status = SubscriptionRequest.Status.REJECTED
    subscription_request.decided_at = timezone.now()
    subscription_request.decided_by = admin_user
    subscription_request.admin_note = note
    subscription_request.save(
        update_fields=[
            "status",
            "decided_at",
            "decided_by",
            "admin_note",
        ]
    )

    return subscription_request


@transaction.atomic
def cancel_subscription_request(subscription_request):
    subscription_request = (
        SubscriptionRequest.objects.select_for_update()
        .get(pk=subscription_request.pk)
    )

    if subscription_request.status not in PENDING_REQUEST_STATUSES:
        raise ValidationError("This request can no longer be cancelled.")

    subscription_request.status = SubscriptionRequest.Status.CANCELLED
    subscription_request.save(update_fields=["status"])

    return subscription_request