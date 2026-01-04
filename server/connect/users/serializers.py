from rest_framework import serializers
from .models import User, ServiceProvider

class ServiceProviderSerializer(serializers.ModelSerializer):
    # User fields (input only, write-only)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    # Optional company name field
    company_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ServiceProvider
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'password',
            'phone_number',
            'company_name',  # included to save in DB
        ]

    def create(self, validated_data):
        # Extract user-related data
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        # Create User with forced role
        user = User.objects.create(
            username=email,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role='service_provider'  # ✅ backend sets role automatically
        )
        user.set_password(password)
        user.save()

        # Create ServiceProvider profile
        service_provider = ServiceProvider.objects.create(
            user=user,
            phone_number=validated_data.get('phone_number'),
            company_name=validated_data.get('company_name')  # ✅ store company name
        )

        return service_provider
