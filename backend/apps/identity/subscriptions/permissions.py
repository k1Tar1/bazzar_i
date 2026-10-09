from rest_framework.permissions import BasePermission

from apps.identity.seller.models import SellerProfile, VerifiedSellerId


class IsVerifiedSeller(BasePermission):
    message = "You must have a verified seller identity."

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        try:
            seller = user.seller_profile
        except SellerProfile.DoesNotExist:
            return False

        return VerifiedSellerId.objects.filter(
            seller=seller
        ).exists()