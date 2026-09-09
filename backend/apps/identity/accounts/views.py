# reanable the throttle later for production
# change the response refresh token security from scure = False to True later

from django.conf import settings
from rest_framework.views import APIView
from apps.identity.accounts.serializers import LogoutSerializer
from rest_framework import status
from apps.identity.accounts.serializers import SellerRegistrationSerializer
from rest_framework.generics import CreateAPIView
from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, VerifyEmailSerializer, ResendVerificationSerializer, AuthUserSerializer, GoogleLoginSerializer
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


class RegisterThrottle(AnonRateThrottle):
    rate = "10/hour"

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    # throttle_classes = [
    #     RegisterThrottle
    # ]
class SellerRegistrationView(CreateAPIView):
    serializer_class = SellerRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):

        response = super().post(
            request,
            *args,
            **kwargs
        )

        refresh_token = response.data.pop(
            "refresh",
            None
        )

        if refresh_token:

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False, # for development change it to True later
                samesite="Lax",
                max_age=7 * 24 * 60 * 60,
            )

        return response

class RefreshTokenView(APIView):

    def post(self, request):

        refresh_token = request.COOKIES.get(
            "refresh_token"
        )

        if not refresh_token:
            return Response(
                {
                    "detail": "Refresh token not found."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(
            data={
                "refresh": refresh_token
            }
        )

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        response_data = {
            "access": data["access"]
        }

        response = Response(
            response_data,
            status=status.HTTP_200_OK,
        )

        # If SimpleJWT rotated the refresh token,
        # replace the cookie with the new one.
        if "refresh" in data:

            response.set_cookie(
                key="refresh_token",
                value=data["refresh"],
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=7 * 24 * 60 * 60,
            )

        return response        

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        google_user = serializer.validated_data["google_user"]

        email = google_user["email"]
        first_name = google_user.get("given_name", "")
        last_name = google_user.get("family_name", "")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "is_email_verified": True,
            },
        )

        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])

        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "access": str(refresh.access_token),
                "user": AuthUserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,  # True in production with HTTPS
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return response

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response = Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK
        )

        response.delete_cookie(
            "refresh_token",
            samesite="Lax",
        )

        return response
class VerifyEmailView(APIView):

    authentication_classes = []

    permission_classes = []

    def post(self, request):

        serializer = VerifyEmailSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message":
                "Email verified successfully."
            },
            status=status.HTTP_200_OK,
        )

class ResendVerificationView(APIView):

    def post(self, request):

        serializer = ResendVerificationSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "message":
                "Verification email sent."
            }
        )

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = AuthUserSerializer(request.user)
        return Response(serializer.data)