from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView
from . import views

urlpatterns = [
    path('create-service-provider/', views.NewServiceProvider, name='service-provider-create'),

    # Email + password login
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh access token
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
