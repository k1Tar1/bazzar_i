from django.urls import path

from apps.identity.seller.views import (
    SellerRegistrationView,
    SellerProfileView,
    SellerIdVerificationView,
    SellerRegistrationVerificationView,
    SellerVerificationStatusView
)


urlpatterns = [
    path(
        "register/",
        SellerRegistrationView.as_view(),
        name="seller_register"
    ),
    path(
        "profile/",
        SellerProfileView.as_view(),
        name="seller-profile"
    ),
    path(
        "id-verification/",
        SellerIdVerificationView.as_view(),
        name="seller-id-verification",
    ),
    path(
        "registration-verification/",
        SellerRegistrationVerificationView.as_view(),
        name="seller-registration-verification",
    ),
    path(
        "verification/",
        SellerVerificationStatusView.as_view(),
        name="seller-verification-status",
    ),
]