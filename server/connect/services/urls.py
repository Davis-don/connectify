from django.urls import path
from . import views

urlpatterns = [
     # ===========================
    # Service Categories
    # ===========================
    path('add-new-category/', views.CreateServiceCategory, name='service-category-create'),
    path('get-all-categories/', views.GetServiceCategories, name='get-all-service-categories'),
    path("get-category/<int:pk>/", views.GetServiceCategoryById),
    path("categories/<int:pk>/update/", views.UpdateServiceCategory),
    path("categories/<int:pk>/delete/", views.DeleteServiceCategory),
]