from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView
from . import views

urlpatterns = [
    # Service Provider routes
    path('create-service-provider/', views.NewServiceProvider, name='service-provider-create'),

    # Email + password login
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh access token
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Fetch logged-in service provider
    path('fetch-service-provider/', views.FetchUserData, name='service-provider-fetch'),

    # Update user info
    path('update-info/', views.UpdateUserInfo, name='update-user-info'),

    # Update password
    path('update-password/', views.UpdateUserPassword, name='update-user-password'),

    # System Manager routes
    path('create-system-manager/', views.NewSystemManager, name='system-manager-create'),

    # Fetch logged-in system manager (dedicated)
    path('fetch-system-manager/', views.FetchSystemManagerData, name='system-manager-fetch'),
]
