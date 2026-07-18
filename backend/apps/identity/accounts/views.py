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
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView

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

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_205_RESET_CONTENT,
        )