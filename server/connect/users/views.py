from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    ServiceProviderSerializer,
    MyTokenObtainPairSerializer,
    AuthenticatedUserSerializer,   # 👈 NEW import
)


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
