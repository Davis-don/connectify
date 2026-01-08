from rest_framework import serializers
from .models import ServiceCategory, Service


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = [
            "id",
            "category_name",
            "description",
            "is_active",
            "created_at",
        ]
        read_only_fields = ("id", "created_at")


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.category_name",
        read_only=True
    )

    class Meta:
        model = Service
        fields = [
            "id",
            "category",
            "category_name",
            "service_name",
            "description",
            "is_active",
            "created_at",
        ]
        read_only_fields = ("id", "created_at")

    def validate(self, attrs):
        """
        Prevent duplicate service names under the same category
        """
        category = attrs.get("category")
        service_name = attrs.get("service_name")

        if self.instance:
            exists = Service.objects.filter(
                category=category,
                service_name__iexact=service_name
            ).exclude(id=self.instance.id).exists()
        else:
            exists = Service.objects.filter(
                category=category,
                service_name__iexact=service_name
            ).exists()

        if exists:
            raise serializers.ValidationError(
                "This service already exists in the selected category."
            )

        return attrs
