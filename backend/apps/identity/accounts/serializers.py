from django.conf import settings
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import User, SellerProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from .validators import validate_phone
from .services import EmailService
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from .tokens import email_verification_token
from google.oauth2 import id_token
from google.auth.transport import requests

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "address",
            "is_email_verified",
            "created_at",
            "updated_at",
            "wilaya",
        )
        read_only_fields = (
            "id",
            "email",
            "is_email_verified",
            "created_at",
            "updated_at",
        )

class SellerSummarySerializer(serializers.ModelSerializer):

    class Meta:
        model = SellerProfile
        fields = (
            "is_seller",
            "verification_status",
        )
    
    def get_is_seller(self, obj):
        return True

class AuthUserSerializer(serializers.ModelSerializer):
    is_seller = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "address",
            "wilaya",
            "is_email_verified",
            "is_seller",
            "is_admin",
            "created_at",
            "seller",
        )

    def get_is_seller(self, obj):
        return hasattr(obj, "seller_profile")

    def get_is_admin(self, obj):
        return obj.groups.filter(name="Admin").exists()

    def get_seller(self, obj):
        if hasattr(obj, "seller_profile"):
            return SellerProfileSerializer(
                obj.seller_profile
            ).data

        return None        

class SellerProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = SellerProfile
        fields = (
            "nin",
            "nif",
            "verification_status",
            "created_at",
            "updated_at",
            "business_wilaya",
            "business_address",
        )
        read_only_fields = (
            "created_at",
            "verification_status",
            "updated_at",
        )

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
    )
    phone = serializers.CharField(
        validators=[validate_phone],
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
            "wilaya",
            "address",
            "is_seller",
            "is_admin",
        ]
        read_only_fields = [
            "id",
            "is_seller",
            "is_admin",
        ]

    def create(self, validated_data):

        user = User.objects.create_user(**validated_data)

        EmailService.send_verification_email(user)

        return user

class SellerRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = SellerProfile
        fields = (
            "nin",
            "nif",
            "business_wilaya",
            "business_address",
        )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.is_active or not user.is_email_verified:
            raise serializers.ValidationError(
                "You must be an active and email-verified user to register as a seller."
            )

        if hasattr(user, "seller_profile"):
            raise serializers.ValidationError(
                "You are already registered as a seller."
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):

        user = self.context["request"].user

        seller_profile = SellerProfile.objects.create(
            user=user,
            **validated_data
        )

        seller_group = Group.objects.get_or_create(name="Seller")
        user.groups.add(seller_group)

        return seller_profile

class LoginSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data["user"] = UserSerializer(user).data

        return data

class GoogleLoginSerializer(serializers.Serializer):
    credential = serializers.CharField(write_only=True)

    def validate(self, attrs):
        credential = attrs["credential"]

        try:
            google_user = id_token.verify_oauth2_token(
                credential,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError:
            raise serializers.ValidationError(
                {"credential": "Invalid Google credential."}
            )

        email = google_user.get("email")
        email_verified = google_user.get("email_verified", False)

        if not email:
            raise serializers.ValidationError(
                {"credential": "Google account has no email address."}
            )

        if not email_verified:
            raise serializers.ValidationError(
                {"credential": "Google email is not verified."}
            )

        attrs["google_user"] = google_user

        return attrs

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def save(self):
        try:
            token = RefreshToken(self.validated_data["refresh"])
            token.blacklist()
        except TokenError:
            raise serializers.ValidationError(
                "Invalid or expired refresh token."
            )

class VerifyEmailSerializer(serializers.Serializer):

    uid = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):

        try:
            uid = force_str(
                urlsafe_base64_decode(attrs["uid"])
            )

            user = User.objects.get(pk=uid)

        except Exception:
            raise serializers.ValidationError(
                "Invalid verification link."
            )

        if not email_verification_token.check_token(
            user,
            attrs["token"],
        ):
            raise serializers.ValidationError(
                "Invalid or expired token."
            )

        attrs["user"] = user

        return attrs

    def save(self):

        user = self.validated_data["user"]

        user.is_email_verified = True

        user.save(update_fields=["is_email_verified"])

        return user

class ResendVerificationSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):

        user = User.objects.filter(
            email=value
        ).first()

        if user is None:
            raise serializers.ValidationError(
                "No account exists with this email address."
            )

        if user.is_email_verified:
            raise serializers.ValidationError(
                "This email has already been verified."
            )
        
        self.user = user

        return value

    def save(self):

        EmailService.send_verification_email(
            self.user
        )