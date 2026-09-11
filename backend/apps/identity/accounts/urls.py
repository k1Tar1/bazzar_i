from apps.identity.accounts.views import PasswordResetRequestView
from apps.identity.accounts.views import PasswordResetConfirmView
from apps.identity.accounts.views import GoogleLoginView
from apps.identity.accounts.views import RefreshTokenView
from apps.identity.accounts.views import VerifyEmailView
from apps.identity.accounts.views import LogoutView
from rest_framework_simplejwt.views import TokenRefreshView
from apps.identity.accounts.views import LoginView
from apps.identity.accounts.views import SellerRegistrationView
from django.urls import path
from .views import RegisterView, CurrentUserView, ChangePasswordView

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
        "google/login/", 
        GoogleLoginView.as_view(), 
        name="google-login"
    ),
    # path(
    #     "refresh/",
    #     TokenRefreshView.as_view(),
    #     name="token_refresh",
    # ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
    path(
        "verify-email/",
        VerifyEmailView.as_view(),
        name="verify-email",
    ),
    path(
        "refresh/",
        RefreshTokenView.as_view(),
        name="refresh-token",
    ),

    path(
        "current-user/",
        CurrentUserView.as_view(),
        name="current-user",
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),

    path(
        "password-reset/",
        PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),
    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
]