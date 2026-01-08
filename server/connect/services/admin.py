from django.contrib import admin
from .models import ServiceCategory, Service


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "category_name",
        "is_active",
        "created_at",
    )
    search_fields = ("category_name",)
    list_filter = ("is_active",)
    ordering = ("category_name",)
    prepopulated_fields = {}  # keep for future slugs if needed


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "service_name",
        "category",
        "is_active",
        "created_at",
    )
    search_fields = ("service_name",)
    list_filter = ("category", "is_active")
    ordering = ("service_name",)
    autocomplete_fields = ("category",)
