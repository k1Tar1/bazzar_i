from django.contrib import admin

from .models import (
    BillingRecord,
    Subscription,
    SubscriptionHistory,
    SubscriptionPlan,
)


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "price",
        "currency",
        "duration_days",
        "max_stores",
        "max_products_per_store",
        "max_pending_orders_total",
        "custom_url_allowed",
        "is_free",
        "is_active",
    )

    list_filter = ("is_free", "is_active", "custom_url_allowed")
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
    search_fields = (
        "seller__user__email",
        "plan__name",
    )
    readonly_fields = ("created_at", "updated_at")


@admin.register(SubscriptionHistory)
class SubscriptionHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "subscription",
        "event_type",
        "previous_plan",
        "plan",
        "created_at",
    )

    list_filter = ("event_type", "plan")
    readonly_fields = (
        "subscription",
        "event_type",
        "previous_plan",
        "plan",
        "period_start",
        "period_end",
        "actor",
        "note",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(BillingRecord)
class BillingRecordAdmin(admin.ModelAdmin):
    list_display = (
        "subscription",
        "plan",
        "amount",
        "currency",
        "status",
        "paid_at",
        "created_at",
    )

    list_filter = ("status", "currency", "plan")
    search_fields = (
        "subscription__seller__user__email",
        "provider_reference",
    )
    readonly_fields = ("created_at", "updated_at")