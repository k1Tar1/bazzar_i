from apps.identity.seller.models import SellerProfile
from rest_framework.permissions import BasePermission
from apps.identity.seller.models import (
    SellerIdVerificationDemand,
    VerifiedSellerId,
)


def get_identity_verification_status(seller):
    """
    Return the current identity verification status
    for a seller.

    Possible values:
        - unverified
        - pending
        - rejected
        - verified
    """

    # A verified identity takes priority.
    if VerifiedSellerId.objects.filter(
        seller=seller
    ).exists():
        return "verified"

    # Otherwise, check for an existing verification demand.
    demand = (
        SellerIdVerificationDemand.objects
        .filter(seller=seller)
        .first()
    )

    if demand:
        return demand.status

    # No verified identity and no demand.
    return "unverified"

class IsSeller(BasePermission):
    message = "You do not have a seller profile."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        try:
            request.user.seller_profile
            return True
        except SellerProfile.DoesNotExist:
            return False

class IsVerifiedSeller(BasePermission):
    message = (
        "You must have a verified identity "
        "to access seller functionality."
    )

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        try:
            seller = request.user.seller_profile
        except SellerProfile.DoesNotExist:
            return False

        return (
            get_identity_verification_status(seller)
            == "verified"
        )