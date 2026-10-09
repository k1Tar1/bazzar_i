from rest_framework import serializers

from apps.identity.subscriptions.models import (
    Subscription,
    SubscriptionPlan,
    SubscriptionRequest,
)
from apps.identity.subscriptions.services.subscriptions import (
    create_subscription_request,
)


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "currency",
            "duration_days",
            "max_stores",
            "max_products_per_store",
            "max_pending_orders_per_product",
            "max_pending_orders_total",
            "custom_url_allowed",
        )


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = (
            "id",
            "plan",
            "status",
            "started_at",
            "current_period_start",
            "current_period_end",
            "grace_ends_at",
        )


class SubscriptionRequestSerializer(serializers.ModelSerializer):
    requested_plan = SubscriptionPlanSerializer(read_only=True)
    requested_plan_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPlan.objects.filter(
            is_active=True,
            is_free=False,
        ),
        source="requested_plan",
        write_only=True,
    )

    class Meta:
        model = SubscriptionRequest
        fields = (
            "id",
            "requested_plan",
            "requested_plan_id",
            "payment_method",
            "status",
            "requested_at",
            "payment_reported_at",
            "decided_at",
            "admin_note",
        )
        read_only_fields = (
            "status",
            "requested_at",
            "payment_reported_at",
            "decided_at",
            "admin_note",
        )

    def create(self, validated_data):
        subscription = self.context["subscription"]

        return create_subscription_request(
            subscription=subscription,
            requested_plan=validated_data["requested_plan"],
            payment_method=validated_data["payment_method"],
        )