from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from apps.identity.subscriptions.models import (
    Subscription,
    SubscriptionPlan,
    SubscriptionRequest,
)
from apps.identity.subscriptions.services.subscriptions import (
    approve_subscription_request,
    reject_subscription_request,
)


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "price",
        "currency",
        "duration_days",
        "is_free",
        "is_active",
        "sort_order",
    )
    list_filter = ("is_free", "is_active")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("sort_order", "price")


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "seller",
        "plan",
        "status",
        "current_period_start",
        "current_period_end",
        "grace_ends_at",
    )
    list_filter = ("status", "plan")
    search_fields = ("seller__user__email", "plan__name")
    readonly_fields = ("created_at", "updated_at")


@admin.action(description="Confirm cash received and approve requests")
def approve_requests(modeladmin, request, queryset):
    approved = 0

    for subscription_request in queryset:
        try:
            approve_subscription_request(
                subscription_request,
                admin_user=request.user,
            )
            approved += 1
        except ValidationError as exc:
            modeladmin.message_user(
                request,
                f"Request #{subscription_request.pk}: {exc}",
                level=messages.ERROR,
            )

    if approved:
        modeladmin.message_user(
            request,
            f"{approved} subscription request(s) approved.",
            level=messages.SUCCESS,
        )


@admin.action(description="Reject selected subscription requests")
def reject_requests(modeladmin, request, queryset):
    rejected = 0

    for subscription_request in queryset:
        try:
            reject_subscription_request(
                subscription_request,
                admin_user=request.user,
                note="Rejected by administrator.",
            )
            rejected += 1
        except ValidationError as exc:
            modeladmin.message_user(
                request,
                f"Request #{subscription_request.pk}: {exc}",
                level=messages.ERROR,
            )

    if rejected:
        modeladmin.message_user(
            request,
            f"{rejected} subscription request(s) rejected.",
            level=messages.SUCCESS,
        )


@admin.register(SubscriptionRequest)
class SubscriptionRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "subscription",
        "requested_plan",
        "payment_method",
        "status",
        "requested_at",
        "payment_reported_at",
    )
    list_filter = ("status", "payment_method", "requested_plan")
    search_fields = (
        "subscription__seller__user__email",
        "requested_plan__name",
    )
    readonly_fields = (
        "requested_at",
        "payment_reported_at",
        "decided_at",
        "decided_by",
    )
    actions = [approve_requests, reject_requests]