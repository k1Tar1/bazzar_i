from django.db import transaction
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import SellerIdVerificationDemand, SellerProfile, VerifiedSellerId, SellerRegistrationVerificationDemand, VerifiedSellerRegistry
from apps.identity.accounts.validators import validate_phone
from apps.identity.accounts.serializers import AuthUserSerializer


class SellerProfileSerializer(serializers.ModelSerializer):

    user = AuthUserSerializer(read_only=True)
    business_phone = serializers.CharField(
        validators=[validate_phone],
    )
    verification_status = serializers.SerializerMethodField()
    register_verification_status = serializers.SerializerMethodField()

    class Meta:
        model = SellerProfile
        fields = (
            "business_wilaya",
            "business_address",
            "business_phone",
            "verification_status",
            "register_verification_status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "created_at",
            "verification_status",
            "register_verification_status",
            "updated_at",
        )

    def get_verification_status(self, seller):
        if VerifiedSellerId.objects.filter(seller=seller).exists():
            return "verified"

        demand = SellerIdVerificationDemand.objects.filter(
            seller=seller
        ).first()

        if demand:
            return demand.status

        return "unverified"

    def get_register_verification_status(self, seller):
        if VerifiedSellerRegistry.objects.filter(seller=seller).exists():
            return "verified"

        demand = SellerRegistrationVerificationDemand.objects.filter(
            seller=seller
        ).first()

        if demand:
            return demand.status

        return "unverified"


class SellerRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = SellerProfile
        fields = (
            "business_wilaya",
            "business_address",
            "business_phone",
        )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.is_email_verified:
            raise serializers.ValidationError(
                "You must be an email-verified user to register as a seller."
            )

        if user.groups.filter(name="Seller").exists() or user.groups.filter(name="Admin").exists():
            raise serializers.ValidationError({
                "detail": "You are already registered as a seller."
            })

        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user

        seller_profile = SellerProfile.objects.create(
            user=user,
            **validated_data,
        )

        seller_group, created = Group.objects.get_or_create(name="Seller")
        user.groups.add(seller_group)

        return seller_profile

    @transaction.atomic
    def create(self, validated_data):

        user = self.context["request"].user

        seller_profile = SellerProfile.objects.create(
            user=user,
            **validated_data
        )

        seller_group, _ = Group.objects.get_or_create(name="Seller")
        user.groups.add(seller_group)

        return seller_profile


class SellerIdVerificationDemandSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = SellerIdVerificationDemand

        fields = (
            "id",
            "id_image",
            "selfie_image",
            "nin",
            "status",
            "feedback",
            "created_at",
            "updated_at",
            "token",
        )

        read_only_fields = (
            "id",
            "status",
            "feedback",
            "created_at",
            "updated_at",
            "token",
        )

    def validate_nin(self, value):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "NIN must contain only digits."
            )

        if len(value) != 18:
            raise serializers.ValidationError(
                "NIN must contain exactly 18 digits."
            )

        return value

    def validate(self, attrs):
        user = self.context["request"].user

        try:
            seller = user.seller_profile
        except SellerProfile.DoesNotExist:
            raise serializers.ValidationError(
                "You do not have a seller profile."
            )

        if VerifiedSellerId.objects.filter(
            seller=seller
        ).exists():
            raise serializers.ValidationError(
                "Your identity has already been verified."
            )

        existing_demand = (
            SellerIdVerificationDemand.objects.filter(
                seller=seller
            ).first()
        )

        if existing_demand:
            if (
                existing_demand.status
                == SellerIdVerificationDemand
                .VerificationDemandStatus.pending
            ):
                raise serializers.ValidationError(
                    "You already have a pending verification request."
                )

        return attrs

class SellerRegistrationVerificationDemandSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = SellerRegistrationVerificationDemand
        fields = (
            "id",
            "token",
            "business_registration_image",
            "nif",
            "status",
            "feedback",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "token",
            "status",
            "feedback",
            "created_at",
            "updated_at",
        )

    def validate_nif(self, value):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "NIF must contain only digits."
            )

        if len(value) != 15:
            raise serializers.ValidationError(
                "NIF must contain exactly 15 digits."
            )

        return value