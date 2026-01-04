from rest_framework import serializers
from .models import User, ServiceProvider

class ServiceProviderSerializer(serializers.ModelSerializer):
    # Fields from the related User
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = ServiceProvider
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'password', 'phone_number']

    def create(self, validated_data):
        # 1. Extract user data
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        role = validated_data.pop('role')
        password = validated_data.pop('password')

        # 2. Create User
        user = User(
            username=email,  # or any unique username logic
            first_name=first_name,
            last_name=last_name,
            email=email,
            role=role
        )
        user.set_password(password)
        user.save()

        # 3. Create ServiceProvider linked to User
        service_provider = ServiceProvider.objects.create(
            user=user,
            phone_number=validated_data['phone_number']
        )

        return service_provider
