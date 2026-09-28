from rest_framework import serializers

from apps.identity.accounts.models import (
    SellerIdVerificationDemand,
    SellerRegistrationVerificationDemand,
)


class AdminIdVerificationSerializer(serializers.ModelSerializer):
    seller_email = serializers.CharField(
        source="seller.user.email",
        read_only=True,
    )

    seller_name = serializers.SerializerMethodField()

    class Meta:
        model = SellerIdVerificationDemand
        fields = (
            "id",
            "seller_email",
            "seller_name",
            "id_image",
            "selfie_image",
            "nin",
            "status",
            "feedback",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields

    def get_seller_name(self, obj):
        return (
            f"{obj.seller.user.first_name} "
            f"{obj.seller.user.last_name}"
        ).strip()

class AdminRegistrationVerificationSerializer(
    serializers.ModelSerializer
):
    seller_email = serializers.CharField(
        source="seller.user.email",
        read_only=True,
    )

    seller_name = serializers.SerializerMethodField()

    class Meta:
        model = SellerRegistrationVerificationDemand

        fields = (
            "id",
            "seller_email",
            "seller_name",
            "business_registration_image",
            "nif",
            "status",
            "feedback",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields

    def get_seller_name(self, obj):
        return (
            f"{obj.seller.user.first_name} "
            f"{obj.seller.user.last_name}"
        ).strip()