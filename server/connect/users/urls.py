from django.urls import path
from . import views

urlpatterns = [
    path('create-service-provider/', views.NewServiceProvider, name='service-provider'),
]