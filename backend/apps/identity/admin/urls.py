from apps.identity.admin.views import AdminVerificationSummaryView
from django.urls import path

from .views import (
    AdminIdVerificationListView,
    AdminIdVerificationDetailView,
    AdminIdVerificationApproveView,
    AdminIdVerificationRejectView,
    AdminRegistrationVerificationListView,
    AdminRegistrationVerificationDetailView,
    AdminRegistrationVerificationApproveView,
    AdminRegistrationVerificationRejectView,
)


urlpatterns = [
    path(
        "id-verifications/",
        AdminIdVerificationListView.as_view(),
        name="admin-id-verifications",
    ),

    path(
        "id-verifications/<int:pk>/",
        AdminIdVerificationDetailView.as_view(),
        name="admin-id-verification-detail",
    ),

    path(
        "id-verifications/<int:pk>/approve/",
        AdminIdVerificationApproveView.as_view(),
        name="admin-id-verification-approve",
    ),

    path(
        "id-verifications/<int:pk>/reject/",
        AdminIdVerificationRejectView.as_view(),
        name="admin-id-verification-reject",
    ),

    path(
        "id-verifications/",
        AdminIdVerificationListView.as_view(),
        name="admin-id-verifications",
    ),

    path(
        "id-verifications/<int:pk>/",
        AdminIdVerificationDetailView.as_view(),
        name="admin-id-verification-detail",
    ),

    path(
        "id-verifications/<int:pk>/approve/",
        AdminIdVerificationApproveView.as_view(),
        name="admin-id-verification-approve",
    ),

    path(
        "id-verifications/<int:pk>/reject/",
        AdminIdVerificationRejectView.as_view(),
        name="admin-id-verification-reject",
    ),

    # Business registration
    path(
        "registration-verifications/",
        AdminRegistrationVerificationListView.as_view(),
        name="admin-registration-verifications",
    ),

    path(
        "registration-verifications/<int:pk>/",
        AdminRegistrationVerificationDetailView.as_view(),
        name="admin-registration-verification-detail",
    ),

    path(
        "registration-verifications/<int:pk>/approve/",
        AdminRegistrationVerificationApproveView.as_view(),
        name="admin-registration-verification-approve",
    ),

    path(
        "registration-verifications/<int:pk>/reject/",
        AdminRegistrationVerificationRejectView.as_view(),
        name="admin-registration-verification-reject",
    ),
    path(
        "verification-summary/",
        AdminVerificationSummaryView.as_view(),
        name="admin-verification-summary",
    ),
]