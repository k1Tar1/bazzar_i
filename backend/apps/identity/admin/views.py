from django.db.models import Q
from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.identity.seller.models import (
    SellerIdVerificationDemand,
    VerifiedSellerId,
    SellerRegistrationVerificationDemand,
    VerifiedSellerRegistry,
)

from apps.identity.admin.permissions import IsAdminUser
from .serializers import (
    AdminIdVerificationSerializer,
    AdminRegistrationVerificationSerializer
)

class AdminIdVerificationListView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get(self, request):
        demands = (
            SellerIdVerificationDemand.objects
            .select_related(
                "seller__user"
            )
            .filter(
                status=SellerIdVerificationDemand.VerificationDemandStatus.pending
            )
            .order_by("-created_at")
        )

        serializer = AdminIdVerificationSerializer(
            demands,
            many=True,
        )

        return Response(serializer.data)

class AdminIdVerificationDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get_object(self, pk):
        try:
            return (
                SellerIdVerificationDemand.objects
                .select_related(
                    "seller__user"
                )
                .get(pk=pk)
            )
        except SellerIdVerificationDemand.DoesNotExist:
            return None

    def get(self, request, pk):
        demand = self.get_object(pk)

        if not demand:
            return Response(
                {"detail": "Verification request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminIdVerificationSerializer(demand)

        return Response(serializer.data)

class AdminIdVerificationApproveView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    @transaction.atomic
    def post(self, request, pk):
        try:
            demand = (
                SellerIdVerificationDemand.objects
                .select_related("seller")
                .get(pk=pk)
            )
        except SellerIdVerificationDemand.DoesNotExist:
            return Response(
                {"detail": "Verification request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            demand.status
            != SellerIdVerificationDemand.VerificationDemandStatus.pending
        ):
            return Response(
                {
                    "detail": (
                        "Only pending verification requests "
                        "can be approved."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if VerifiedSellerId.objects.filter(
            seller=demand.seller
        ).exists():
            return Response(
                {
                    "detail": (
                        "This seller is already identity verified."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        verified_seller = VerifiedSellerId.objects.create(
            seller=demand.seller,
            id_image=demand.id_image,
            selfie_image=demand.selfie_image,
            nin=demand.nin,
            accepted_by=request.user,
            verification_type=VerifiedSellerId.VerificationType.online,
        )

        demand.delete()

        return Response(
            {
                "detail": "Seller identity verification approved.",
                "verification_id": verified_seller.id,
            },
            status=status.HTTP_200_OK,
        )

class AdminIdVerificationRejectView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def post(self, request, pk):
        try:
            demand = SellerIdVerificationDemand.objects.get(
                pk=pk
            )
        except SellerIdVerificationDemand.DoesNotExist:
            return Response(
                {"detail": "Verification request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            demand.status
            != SellerIdVerificationDemand.VerificationDemandStatus.pending
        ):
            return Response(
                {
                    "detail": (
                        "Only pending verification requests "
                        "can be rejected."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        feedback = request.data.get("feedback")

        if not feedback or not feedback.strip():
            return Response(
                {
                    "feedback": [
                        "Feedback is required when rejecting "
                        "a verification request."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        demand.status = (
            SellerIdVerificationDemand
            .VerificationDemandStatus.rejected
        )

        demand.feedback = feedback.strip()

        demand.save(
            update_fields=[
                "status",
                "feedback",
                "updated_at",
            ]
        )

        return Response(
            {
                "detail": "Seller identity verification rejected.",
            },
            status=status.HTTP_200_OK,
        )

class AdminRegistrationVerificationListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        demands = (
            SellerRegistrationVerificationDemand.objects
            .select_related("seller__user")
            .all()
            .order_by("-created_at")
        )

        serializer = AdminRegistrationVerificationSerializer(
            demands,
            many=True,
        )

        return Response(serializer.data)

class AdminRegistrationVerificationDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        try:
            demand = (
                SellerRegistrationVerificationDemand.objects
                .select_related("seller__user")
                .get(pk=pk)
            )
        except SellerRegistrationVerificationDemand.DoesNotExist:
            return Response(
                {"detail": "Verification request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminRegistrationVerificationSerializer(
            demand
        )

        return Response(serializer.data)

class AdminRegistrationVerificationApproveView(APIView):
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def post(self, request, pk):
        try:
            demand = (
                SellerRegistrationVerificationDemand.objects
                .select_related("seller")
                .get(pk=pk)
            )
        except SellerRegistrationVerificationDemand.DoesNotExist:
            return Response(
                {"detail": "Verification request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            demand.status
            != SellerRegistrationVerificationDemand
            .VerificationDemandStatus.pending
        ):
            return Response(
                {
                    "detail": (
                        "Only pending verification "
                        "requests can be approved."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if VerifiedSellerRegistry.objects.filter(
            seller=demand.seller
        ).exists():
            return Response(
                {
                    "detail": (
                        "This seller's business registration "
                        "is already verified."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        verified_registry = VerifiedSellerRegistry.objects.create(
            seller=demand.seller,
            business_registration_image=(
                demand.business_registration_image
            ),
            nif=demand.nif,
            accepted_by=request.user,
            verification_type=(
                VerifiedSellerRegistry
                .VerificationType
                .online
            ),
        )

        demand.delete()

        return Response(
            {
                "detail": (
                    "Business registration verification "
                    "approved successfully."
                ),
                "id": verified_registry.id,
            },
            status=status.HTTP_200_OK,
        )

class AdminRegistrationVerificationApproveView(APIView):
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def post(self, request, pk):
        try:
            demand = (
                SellerRegistrationVerificationDemand.objects
                .select_related("seller")
                .get(pk=pk)
            )
        except SellerRegistrationVerificationDemand.DoesNotExist:
            return Response(
                {"detail": "Verification request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            demand.status
            != SellerRegistrationVerificationDemand
            .VerificationDemandStatus.pending
        ):
            return Response(
                {
                    "detail": (
                        "Only pending verification "
                        "requests can be approved."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if VerifiedSellerRegistry.objects.filter(
            seller=demand.seller
        ).exists():
            return Response(
                {
                    "detail": (
                        "This seller's business registration "
                        "is already verified."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        verified_registry = VerifiedSellerRegistry.objects.create(
            seller=demand.seller,
            business_registration_image=(
                demand.business_registration_image
            ),
            nif=demand.nif,
            accepted_by=request.user,
            verification_type=(
                VerifiedSellerRegistry
                .VerificationType
                .online
            ),
        )

        demand.delete()

        return Response(
            {
                "detail": (
                    "Business registration verification "
                    "approved successfully."
                ),
                "id": verified_registry.id,
            },
            status=status.HTTP_200_OK,
        )

class AdminVerificationSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        identity_pending = (
            SellerIdVerificationDemand.objects
            .filter(
                status=SellerIdVerificationDemand
                .VerificationDemandStatus.pending
            )
            .count()
        )

        identity_rejected = (
            SellerIdVerificationDemand.objects
            .filter(
                status=SellerIdVerificationDemand
                .VerificationDemandStatus.rejected
            )
            .count()
        )

        registration_pending = (
            SellerRegistrationVerificationDemand.objects
            .filter(
                status=SellerRegistrationVerificationDemand
                .VerificationDemandStatus.pending
            )
            .count()
        )

        registration_rejected = (
            SellerRegistrationVerificationDemand.objects
            .filter(
                status=SellerRegistrationVerificationDemand
                .VerificationDemandStatus.rejected
            )
            .count()
        )

        return Response({
            "identity": {
                "pending": identity_pending,
                "rejected": identity_rejected,
            },
            "registration": {
                "pending": registration_pending,
                "rejected": registration_rejected,
            },
        })


# class AdminAllIdVerificationListView(APIView):
#     permission_classes = [
#         IsAuthenticated,
#         IsAdminUser,
#     ]

#     def get(self, request):
#         search_query = request.query_params.get(
#             "search", 
#             ""
#         ).strip()
#         page = int(request.query_params.get("page", 1))
#         page_size = int(request.query_params.get("page_size", 20))

#         queryset = (
#             SellerIdVerificationDemand.objects
#             .select_related(
#                 "seller__user"
#             )
#             .order_by("-created_at")
#         )

#         if search_query:
#             queryset = queryset.filter(
#                 Q(seller__user__first_name__icontains=search_query)
#                 | Q(seller__user__last_name__icontains=search_query)
#                 | Q(seller__user__email__icontains=search_query)
#                 | Q(seller__user__phone_number__icontains=search_query)
#                 | Q(seller__user__username__icontains=search_query)
#             )

#         paginator = Paginator(queryset, page_size)
#         paginated_demands = paginator.page(page)

#         serializer = AdminIdVerificationSerializer(
#             paginated_demands,
#             many=True,
#         )

#         return Response(
#             {
#                 "count": paginator.count,
#                 "results": serializer.data,
#             }
#         )