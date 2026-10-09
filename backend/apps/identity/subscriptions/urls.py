from django.urls import path

from apps.identity.subscriptions.views import (
    MySubscriptionView,
    SubscriptionPlanListView,
    SubscriptionRequestActionView,
    SubscriptionRequestListCreateView,
)


urlpatterns = [
    path(
        "plans/",
        SubscriptionPlanListView.as_view(),
        name="subscription-plans",
    ),
    path(
        "me/",
        MySubscriptionView.as_view(),
        name="my-subscription",
    ),
    path(
        "requests/",
        SubscriptionRequestListCreateView.as_view(),
        name="subscription-requests",
    ),
    path(
        "requests/<int:pk>/<str:action>/",
        SubscriptionRequestActionView.as_view(),
        name="subscription-request-action",
    ),
]