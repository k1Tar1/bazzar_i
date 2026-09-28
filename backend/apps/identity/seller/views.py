from django.http import request
from rest_framework.generics import CreateAPIView
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
import secrets
from .permissions import IsSeller
from .models import(
    SellerProfile,
    SellerIdVerificationDemand,
    SellerRegistrationVerificationDemand,
    VerifiedSellerId,
    VerifiedSellerRegistry,
)

from .serializers import (
    SellerProfileSerializer,
    SellerRegistrationSerializer,
    SellerIdVerificationDemandSerializer,
    SellerRegistrationVerificationDemandSerializer,
)

from .services.verification import (
    get_identity_verification_status,
)


class SellerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = SellerProfileSerializer
    permission_classes = [IsSeller]

    def get_object(self):
        return get_object_or_404(
            SellerProfile,
            user=self.request.user,
        )

    def perform_update(self, serializer):
        serializer.save()

class SellerRegistrationView(CreateAPIView):
    serializer_class = SellerRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]


class SellerIdVerificationView(APIView):
    permission_classes = [IsSeller]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_seller(self, request):
        try:
            return request.user.seller_profile
        except SellerProfile.DoesNotExist:
            return None

    def get_demand(self, seller):
        return (
            SellerIdVerificationDemand.objects
            .filter(seller=seller)
            .first()
        )

    def get(self, request):
        seller = self.get_seller(request)

        if not seller:
            return Response(
                {
                    "detail": (
                        "You do not have a seller profile."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        demand = self.get_demand(seller)

        if not demand:
            return Response(
                {
                    "detail": (
                        "No identity verification "
                        "request found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = (
            SellerIdVerificationDemandSerializer(demand)
        )

        return Response(serializer.data)

    def post(self, request):
        seller = self.get_seller(request)

        if not seller:
            return Response(
                {
                    "detail": (
                        "You do not have a seller profile."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # A seller cannot create another demand if
        # one already exists.
        existing_demand = self.get_demand(seller)

        if existing_demand:
            return Response(
                {
                    "detail": (
                        "An identity verification request "
                        "already exists."
                    ),
                    "status": existing_demand.status,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # A verified identity should never create a
        # new verification demand.
        if VerifiedSellerId.objects.filter(
            seller=seller
        ).exists():
            return Response(
                {
                    "detail": (
                        "Your identity is already verified."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = (
            SellerIdVerificationDemandSerializer(
                data=request.data
            )
        )

        serializer.is_valid(raise_exception=True)

        demand = serializer.save(
            seller=seller,
            token=secrets.token_hex(32),
        )

        return Response(
            SellerIdVerificationDemandSerializer(
                demand
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def patch(self, request):
        seller = self.get_seller(request)

        if not seller:
            return Response(
                {
                    "detail": (
                        "You do not have a seller profile."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # If already verified, there is nothing to resubmit.
        if VerifiedSellerId.objects.filter(
            seller=seller
        ).exists():
            return Response(
                {
                    "detail": (
                        "Your identity is already verified."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        demand = self.get_demand(seller)

        if not demand:
            return Response(
                {
                    "detail": (
                        "No identity verification "
                        "request found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            demand.status
            == SellerIdVerificationDemand
            .VerificationDemandStatus.pending
        ):
            return Response(
                {
                    "detail": (
                        "Your identity verification "
                        "is still pending."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # At this point the only valid state is rejected.
        serializer = (
            SellerIdVerificationDemandSerializer(
                demand,
                data=request.data,
                partial=False,
            )
        )

        serializer.is_valid(raise_exception=True)

        demand = serializer.save(
            status=(
                SellerIdVerificationDemand
                .VerificationDemandStatus.pending
            ),
            feedback=None,
        )

        return Response(
            SellerIdVerificationDemandSerializer(
                demand
            ).data
        )

class SellerRegistrationVerificationView(APIView):
    permission_classes = [IsSeller]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_seller(self, request):
        try:
            return request.user.seller_profile
        except SellerProfile.DoesNotExist:
            return None

    def get(self, request):
        seller = self.get_seller(request)

        if not seller:
            return Response(
                {
                    "detail": (
                        "You do not have a seller profile."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        demand = (
            SellerRegistrationVerificationDemand.objects
            .filter(seller=seller)
            .first()
        )

        if not demand:
            return Response(
                {
                    "detail": (
                        "No business registration "
                        "verification request found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = (
            SellerRegistrationVerificationDemandSerializer(
                demand
            )
        )

        return Response(serializer.data)

    def post(self, request):
        seller = self.get_seller(request)
    
        if not seller:
            return Response(
                {
                    "detail": (
                        "You do not have a seller profile."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )
    
        identity_status = get_identity_verification_status(
            seller
        )
    
        if identity_status not in ("pending", "verified"):
            return Response(
                {
                    "detail": (
                        "Identity verification must be "
                        "submitted before business registration "
                        "verification."
                    ),
                    "identity_verification_status": identity_status,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
    
        if SellerRegistrationVerificationDemand.objects.filter(
            seller=seller
        ).exists():
            return Response(
                {
                    "detail": (
                        "You already have a business registration "
                        "verification request."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
    
        serializer = (
            SellerRegistrationVerificationDemandSerializer(
                data=request.data
            )
        )
    
        serializer.is_valid(raise_exception=True)
    
        demand = serializer.save(
            seller=seller,
            token=secrets.token_hex(32),
        )
    
        return Response(
            SellerRegistrationVerificationDemandSerializer(
                demand
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def patch(self, request):
        seller = self.get_seller(request)

        if not seller:
            return Response(
                {
                    "detail": (
                        "You do not have a seller profile."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        identity_status = get_identity_verification_status(
            seller
        )

        if identity_status not in ("pending", "verified"):
            return Response(
                {
                    "detail": (
                        "Identity verification must be "
                        "submitted before business registration "
                        "verification."
                    ),
                    "identity_verification_status": identity_status,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            demand = (
                SellerRegistrationVerificationDemand.objects
                .get(seller=seller)
            )
        except SellerRegistrationVerificationDemand.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "No business registration "
                        "verification request found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            demand.status
            == SellerRegistrationVerificationDemand
            .VerificationDemandStatus.pending
        ):
            return Response(
                {
                    "detail": (
                        "Your business registration "
                        "verification is still pending."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = (
            SellerRegistrationVerificationDemandSerializer(
                demand,
                data=request.data,
                partial=False,
            )
        )

        serializer.is_valid(raise_exception=True)

        demand = serializer.save(
            status=(
                SellerRegistrationVerificationDemand
                .VerificationDemandStatus.pending
            ),
            feedback=None,
        )

        return Response(
            SellerRegistrationVerificationDemandSerializer(
                demand
            ).data
        )

class SellerVerificationStatusView(APIView):
    permission_classes = [IsSeller]

    def get(self, request):
        try:
            seller = request.user.seller_profile
        except SellerProfile.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "You do not have a seller profile."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        identity_status = (
            get_identity_verification_status(seller)
        )

        identity_demand = (
            SellerIdVerificationDemand.objects
            .filter(seller=seller)
            .first()
        )

        registration_demand = (
            SellerRegistrationVerificationDemand.objects
            .filter(seller=seller)
            .first()
        )

        registration_verified = (
            VerifiedSellerRegistry.objects
            .filter(seller=seller)
            .exists()
        )

        if registration_verified:
            registration_status = "verified"
        elif registration_demand:
            registration_status = registration_demand.status
        else:
            registration_status = "unsubmitted"

        return Response(
            {
                "identity": {
                    "id": identity_demand.id if identity_demand else None,
                    "status": identity_status,
                    "feedback": (
                        identity_demand.feedback
                        if identity_demand
                        else None
                    ),
                },
                "registration": {
                    "id": (
                        registration_demand.id
                        if registration_demand
                        else None
                    ),
                    "status": registration_status,
                    "feedback": (
                        registration_demand.feedback
                        if registration_demand
                        else None
                    ),
                    "can_submit": identity_status in (
                        "pending",
                        "verified",
                    ),
                },
            }
        )