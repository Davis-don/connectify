from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    ServiceProviderSerializer,
    MyTokenObtainPairSerializer,
    AuthenticatedUserSerializer,
    UpdateUserInfoSerializer,
    UpdatePasswordSerializer,
)


# =====================================================
# 🔽 CREATE NEW SERVICE PROVIDER
# =====================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def NewServiceProvider(request):
    serializer = ServiceProviderSerializer(data=request.data)
    if serializer.is_valid():
        service_provider = serializer.save()
        return Response(
            ServiceProviderSerializer(service_provider).data,
            status=status.HTTP_201_CREATED
        )
    else:
        return Response(
            {"error": "All fields are required."},
            status=status.HTTP_400_BAD_REQUEST
        )


# =====================================================
# 🔽 JWT LOGIN
# =====================================================
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# =====================================================
# 🔽 FETCH LOGGED-IN USER DATA (JWT REQUIRED)
# =====================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def FetchUserData(request):
    """
    Returns authenticated user data based on JWT token
    """
    serializer = AuthenticatedUserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# =====================================================
# 🔽 UPDATE USER INFO (JWT REQUIRED)
# =====================================================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def UpdateUserInfo(request):
    """
    Updates any user info fields: first_name, last_name, email, phone_number, company_name
    """
    serializer = UpdateUserInfoSerializer(instance=request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User info updated successfully.", "data": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# 🔽 UPDATE USER PASSWORD (JWT REQUIRED)
# =====================================================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def UpdateUserPassword(request):
    """
    Updates user password after validating previous password and matching new password + confirm password
    """
    serializer = UpdatePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Password updated successfully."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
