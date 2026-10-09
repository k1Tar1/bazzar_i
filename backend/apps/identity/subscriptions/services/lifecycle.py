from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.identity.subscriptions.models import (
    Subscription,
    SubscriptionPlan,
)


GRACE_PERIOD_DAYS = 7


@transaction.atomic
def process_subscription_expiration(subscription, now=None):
    """
    Process one subscription.
    Run this periodically, ideally once per day.
    """
    now = now or timezone.now()

    subscription = (
        Subscription.objects.select_for_update()
        .select_related("plan")
        .get(pk=subscription.pk)
    )

    # The Free plan does not expire.
    if subscription.plan.is_free:
        return subscription

    if not subscription.current_period_end:
        return subscription

    if subscription.current_period_end > now:
        return subscription

    # Start the grace period from the original expiration date.
    if subscription.status != Subscription.Status.GRACE_PERIOD:
        subscription.status = Subscription.Status.GRACE_PERIOD
        subscription.grace_ends_at = (
            subscription.current_period_end
            + timedelta(days=GRACE_PERIOD_DAYS)
        )
        subscription.save(
            update_fields=[
                "status",
                "grace_ends_at",
                "updated_at",
            ]
        )

    # If the grace period has ended, switch to Free.
    if subscription.grace_ends_at and now >= subscription.grace_ends_at:
        free_plan = SubscriptionPlan.objects.get(
            is_free=True,
            is_active=True,
        )

        subscription.plan = free_plan
        subscription.status = Subscription.Status.ACTIVE
        subscription.current_period_start = now
        subscription.current_period_end = None
        subscription.grace_ends_at = None
        subscription.save()

    return subscription