from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    description = models.TextField(blank=True)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.CharField(
        max_length=3,
        default="DZD",
    )

    # None means there is no fixed billing period.
    duration_days = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    max_stores = models.PositiveIntegerField(default=1)
    max_products_per_store = models.PositiveIntegerField(default=5)
    max_pending_orders_per_product = models.PositiveIntegerField(default=5)
    max_pending_orders_total = models.PositiveIntegerField(default=25)

    custom_url_allowed = models.BooleanField(default=False)

    is_free = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "price", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["is_free"],
                condition=Q(is_free=True),
                name="one_free_subscription_plan",
            ),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.is_free:
            if self.price != Decimal("0.00"):
                raise ValidationError({
                    "price": "The Free plan must have a price of zero."
                })

            if self.duration_days is not None:
                raise ValidationError({
                    "duration_days": (
                        "The Free plan must not have a fixed duration."
                    )
                })
        elif not self.duration_days:
            raise ValidationError({
                "duration_days": (
                    "Paid plans must have a positive duration."
                )
            })


class Subscription(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        GRACE_PERIOD = "grace_period", "Grace period"

    # Assumes SellerProfile is in the seller app.
    # OneToOneField guarantees one current subscription per seller.
    seller = models.OneToOneField(
        "apps.identity.seller.SellerProfile",
        on_delete=models.PROTECT,
        related_name="subscription",
    )

    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="subscriptions",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    started_at = models.DateTimeField(default=timezone.now)
    current_period_start = models.DateTimeField(default=timezone.now)
    current_period_end = models.DateTimeField(
        null=True,
        blank=True,
    )
    grace_ends_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.seller} — {self.plan.name}"


class SubscriptionHistory(models.Model):
    class EventType(models.TextChoices):
        FREE_ASSIGNED = "free_assigned", "Free plan assigned"
        UPGRADED = "upgraded", "Plan upgraded"
        RENEWED = "renewed", "Subscription renewed"
        GRACE_STARTED = "grace_started", "Grace period started"
        DOWNGRADED_TO_FREE = (
            "downgraded_to_free",
            "Returned to Free plan",
        )

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.PROTECT,
        related_name="history",
    )

    event_type = models.CharField(
        max_length=30,
        choices=EventType.choices,
    )

    previous_plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="previous_plan_events",
    )

    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="subscription_events",
    )

    period_start = models.DateTimeField(null=True, blank=True)
    period_end = models.DateTimeField(null=True, blank=True)

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscription_history_events",
    )

    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.event_type}: {self.plan.name}"


class BillingRecord(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.PROTECT,
        related_name="billing_records",
    )

    # Preserve what was purchased even if the subscription changes plans.
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="billing_records",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    currency = models.CharField(max_length=3, default="DZD")

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    period_start = models.DateTimeField(null=True, blank=True)
    period_end = models.DateTimeField(null=True, blank=True)

    provider_reference = models.CharField(
        max_length=255,
        blank=True,
    )

    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.plan.name}: {self.amount} "
            f"{self.currency} ({self.status})"
        )