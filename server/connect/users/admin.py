from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ServiceProvider, SystemManager

# ---------------------------
# Custom admin for User model
# ---------------------------
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Show these fields in list view
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)
    # Add role field to the user creation and edit forms
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )


# ---------------------------
# Admin for ServiceProvider model
# ---------------------------
@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'company_name')
    search_fields = ('user__username', 'user__email', 'phone_number', 'company_name')


# ---------------------------
# Admin for SystemManager model
# ---------------------------
@admin.register(SystemManager)
class SystemManagerAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number')
    search_fields = ('user__username', 'user__email', 'phone_number')
