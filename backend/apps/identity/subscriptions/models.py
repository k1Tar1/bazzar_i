from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
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
    currency = models.CharField(max_length=3, default="DZD")
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
            )
        ]

    def clean(self):
        if self.is_free:
            if self.price != Decimal("0.00"):
                raise ValidationError({
                    "price": "The Free plan must cost zero."
                })

            if self.duration_days is not None:
                raise ValidationError({
                    "duration_days": "The Free plan has no fixed duration."
                })
        elif not self.duration_days:
            raise ValidationError({
                "duration_days": "Paid plans need a positive duration."
            })

    def __str__(self):
        return self.name


class Subscription(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        GRACE_PERIOD = "grace_period", "Grace period"

    seller = models.OneToOneField(
        "seller.SellerProfile",
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


class SubscriptionRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Awaiting payment"
        PAYMENT_REPORTED = "payment_reported", "Payment reported"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        CANCELLED = "cancelled", "Cancelled"

    class PaymentMethod(models.TextChoices):
        OFFICE_CASH = "office_cash", "Cash at office"
        CASH_TRANSFER = "cash_transfer", "Cash transfer"

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.PROTECT,
        related_name="requests",
    )
    requested_plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="subscription_requests",
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    requested_at = models.DateTimeField(auto_now_add=True)
    payment_reported_at = models.DateTimeField(
        null=True,
        blank=True,
    )
    decided_at = models.DateTimeField(
        null=True,
        blank=True,
    )
    decided_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscription_requests_decided",
    )
    admin_note = models.TextField(blank=True)

    class Meta:
        ordering = ["-requested_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["subscription"],
                condition=Q(
                    status__in=["pending", "payment_reported"]
                ),
                name="one_pending_subscription_request",
            )
        ]

    def clean(self):
        if self.requested_plan_id and self.requested_plan.is_free:
            raise ValidationError({
                "requested_plan": "You can only request a paid plan."
            })

    def __str__(self):
        return (
            f"{self.subscription.seller} → "
            f"{self.requested_plan.name} ({self.status})"
        )