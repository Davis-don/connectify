from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, ServiceProvider, SystemManager


# =====================================================
# 🔽 CREATE SERVICE PROVIDER SERIALIZER
# =====================================================
class ServiceProviderSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    company_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ServiceProvider
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'company_name']

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
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


# =====================================================
# 🔽 CREATE SYSTEM MANAGER SERIALIZER
# =====================================================
class SystemManagerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    class Meta:
        model = SystemManager
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'phone_number']

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return email

    def create(self, validated_data):
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        # Determine role from context or default to admin
        role = validated_data.pop('role', 'admin')

        user = User.objects.create(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        user.set_password(password)
        user.save()

        manager = SystemManager.objects.create(
            user=user,
            phone_number=validated_data.get('phone_number')
        )
        return manager


# =====================================================
# 🔽 JWT TOKEN SERIALIZER
# =====================================================
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
# 🔽 READ SERIALIZERS
# =====================================================
class ServiceProviderReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProvider
        fields = ['id', 'phone_number', 'company_name']


class SystemManagerReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemManager
        fields = ['id', 'phone_number']


class AuthenticatedUserSerializer(serializers.ModelSerializer):
    service_profile = ServiceProviderReadSerializer(read_only=True)
    system_profile = SystemManagerReadSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'service_profile', 'system_profile']


# =====================================================
# 🔽 UPDATE USER INFO SERIALIZER
# =====================================================
class UpdateUserInfoSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False, write_only=True)
    company_name = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'company_name']

    def validate_email(self, email):
        user = self.instance
        if User.objects.exclude(id=user.id).filter(email=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def update(self, instance, validated_data):
        phone_number = validated_data.pop('phone_number', None)
        company_name = validated_data.pop('company_name', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if 'email' in validated_data:
            instance.username = validated_data['email']

        instance.save()

        # Update ServiceProvider or SystemManager profile
        try:
            if instance.role == 'service_provider':
                profile = instance.service_profile
                if phone_number is not None:
                    profile.phone_number = phone_number
                if company_name is not None:
                    profile.company_name = company_name
                profile.save()
            elif instance.role in ['admin', 'agent']:
                profile = instance.system_profile
                if phone_number is not None:
                    profile.phone_number = phone_number
                profile.save()
        except (ServiceProvider.DoesNotExist, SystemManager.DoesNotExist):
            pass

        return instance


# =====================================================
# 🔽 UPDATE PASSWORD SERIALIZER
# =====================================================
class UpdatePasswordSerializer(serializers.Serializer):
    previous_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'}, min_length=8)
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'}, min_length=8)

    def validate(self, attrs):
        user = self.context['request'].user
        prev = attrs.get('previous_password')
        new = attrs.get('new_password')
        confirm = attrs.get('confirm_password')

        if not user.check_password(prev):
            raise serializers.ValidationError({"previous_password": "Previous password is incorrect."})
        if new != confirm:
            raise serializers.ValidationError({"confirm_password": "New password and confirm password do not match."})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
