from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/", include("apps.identity.accounts.urls")),
    path("api/seller/", include("apps.identity.seller.urls")),
    path("api/admin/", include("apps.identity.admin.urls")),
    path("api/regions/", include("apps.identity.regions.urls")),
]
