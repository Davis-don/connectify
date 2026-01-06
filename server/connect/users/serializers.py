from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, ServiceProvider


class ServiceProviderSerializer(serializers.ModelSerializer):
    # User fields (write-only)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )

    company_name = serializers.CharField(
        required=False,
        allow_blank=True
    )

    class Meta:
        model = ServiceProvider
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'password',
            'phone_number',
            'company_name',
        ]

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                'A user with this email already exists.'
            )
        return email

    def create(self, validated_data):
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role='service_provider'
        )
        user.set_password(password)
        user.save()

        service_provider = ServiceProvider.objects.create(
            user=user,
            phone_number=validated_data.get('phone_number'),
            company_name=validated_data.get('company_name')
        )

        return service_provider


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data.update({
            'email': self.user.email,
            'role': self.user.role,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        })

        return data


# =====================================================
# 🔽 ADDITION ONLY — FETCH LOGGED-IN USER VIA JWT TOKEN
# =====================================================

class ServiceProviderReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProvider
        fields = [
            'id',
            'phone_number',
            'company_name',
        ]


class AuthenticatedUserSerializer(serializers.ModelSerializer):
    """
    Used when a valid JWT token is sent.
    Returns user data tied to request.user
    """
    service_profile = ServiceProviderReadSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'service_profile',
        ]
