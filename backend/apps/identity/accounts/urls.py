from apps.identity.accounts.views import LogoutView
from rest_framework_simplejwt.views import TokenRefreshView
from apps.identity.accounts.views import LoginView
from apps.identity.accounts.views import SellerRegistrationView
from django.urls import path
from .views import RegisterView

urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),
    path(
        "register/seller/",
        SellerRegistrationView.as_view(),
        name="seller_register"
    ),
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),
    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
]