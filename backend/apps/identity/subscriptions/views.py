from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.identity.subscriptions.models import (
    Subscription,
    SubscriptionPlan,
    SubscriptionRequest,
)
from apps.identity.subscriptions.permissions import IsVerifiedSeller
from apps.identity.subscriptions.serializers import (
    SubscriptionPlanSerializer,
    SubscriptionRequestSerializer,
    SubscriptionSerializer,
)
from apps.identity.subscriptions.services.subscriptions import (
    cancel_subscription_request,
    report_subscription_payment,
)


class SubscriptionPlanListView(generics.ListAPIView):
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(
            is_active=True
        ).order_by("sort_order", "price")


class MySubscriptionView(generics.RetrieveAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated, IsVerifiedSeller]

    def get_object(self):
        return get_object_or_404(
            Subscription,
            seller=self.request.user.seller_profile,
        )


class SubscriptionRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = SubscriptionRequestSerializer
    permission_classes = [IsAuthenticated, IsVerifiedSeller]

    def get_subscription(self):
        return get_object_or_404(
            Subscription,
            seller=self.request.user.seller_profile,
        )

    def get_queryset(self):
        return SubscriptionRequest.objects.filter(
            subscription=self.get_subscription()
        ).select_related("requested_plan")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["subscription"] = self.get_subscription()
        return context

    def perform_create(self, serializer):
        try:
            serializer.save()
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)


class SubscriptionRequestActionView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedSeller]

    def get_request(self, request, pk):
        return get_object_or_404(
            SubscriptionRequest,
            pk=pk,
            subscription__seller=request.user.seller_profile,
        )

    def post(self, request, pk, action):
        subscription_request = self.get_request(request, pk)

        try:
            if action == "report-payment":
                result = report_subscription_payment(
                    subscription_request
                )

            elif action == "cancel":
                result = cancel_subscription_request(
                    subscription_request
                )

            else:
                return Response(
                    {"detail": "Unknown action."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)

        return Response(
            SubscriptionRequestSerializer(result).data,
            status=status.HTTP_200_OK,
        )