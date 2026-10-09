from django.contrib import admin

from .models import SellerProfile


@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "business_name",
        "verification_status",
        "is_active",
    )
    list_filter = (
        "verification_status",
        "is_active",
    )
    search_fields = (
        "user__email",
        "business_name",
        "business_phone",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
    )
