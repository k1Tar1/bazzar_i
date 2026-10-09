from django.core.management.base import BaseCommand

from apps.identity.subscriptions.models import Subscription
from apps.identity.subscriptions.services.lifecycle import (
    process_subscription_expiration,
)


class Command(BaseCommand):
    help = "Process expired subscriptions and grace periods."

    def handle(self, *args, **options):
        subscriptions = Subscription.objects.select_related("plan")

        processed = 0

        for subscription in subscriptions.iterator():
            process_subscription_expiration(subscription)
            processed += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Processed {processed} subscriptions."
            )
        )