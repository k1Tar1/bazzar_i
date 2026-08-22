from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from .tokens import email_verification_token


class EmailService:

    @staticmethod
    def send_verification_email(user):

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = email_verification_token.make_token(user)

        verification_url = (
            f"{settings.FRONTEND_URL}"
            f"/verify-email/"
            f"?uid={uid}"
            f"&token={token}"
        )

        send_mail(
            subject="Verify your email",
            message=(
                "Click the following link:\n\n"
                f"{verification_url}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )