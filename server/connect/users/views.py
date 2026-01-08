from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    ServiceProviderSerializer,
    SystemManagerSerializer,
    SystemManagerReadSerializer,
    MyTokenObtainPairSerializer,
    AuthenticatedUserSerializer,
    UpdateUserInfoSerializer,
    UpdatePasswordSerializer,
)
from .models import SystemManager


# =====================================================
# 🔽 CREATE NEW SERVICE PROVIDER
# =====================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def NewServiceProvider(request):
    serializer = ServiceProviderSerializer(data=request.data)
    if serializer.is_valid():
        provider = serializer.save()
        return Response(ServiceProviderSerializer(provider).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# 🔽 CREATE NEW SYSTEM MANAGER (Admin/Agent)
# =====================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def NewSystemManager(request):
    if request.user.role != 'admin':
        return Response({"error": "You do not have permission to create system managers."}, status=status.HTTP_403_FORBIDDEN)

    serializer = SystemManagerSerializer(data=request.data)
    if serializer.is_valid():
        manager = serializer.save()
        return Response(SystemManagerSerializer(manager).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# 🔽 JWT LOGIN
# =====================================================
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# =====================================================
# 🔽 FETCH LOGGED-IN SERVICE PROVIDER DATA
# =====================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def FetchUserData(request):
    serializer = AuthenticatedUserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# =====================================================
# 🔽 FETCH LOGGED-IN SYSTEM MANAGER DATA
# =====================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def FetchSystemManagerData(request):
    try:
        manager = request.user.system_profile  # OneToOneField
    except SystemManager.DoesNotExist:
        return Response({"error": "System manager profile not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = SystemManagerReadSerializer(manager)
    return Response(serializer.data, status=status.HTTP_200_OK)


# =====================================================
# 🔽 UPDATE USER INFO
# =====================================================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def UpdateUserInfo(request):
    serializer = UpdateUserInfoSerializer(instance=request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User info updated successfully.", "data": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# 🔽 UPDATE USER PASSWORD
# =====================================================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def UpdateUserPassword(request):
    serializer = UpdatePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Password updated successfully."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# 🔽 SYSTEM MANAGER CRUD VIEWS
# =====================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllSystemManagers(request):
    if request.user.role != 'admin':
        return Response({"error": "You do not have permission to view managers."}, status=status.HTTP_403_FORBIDDEN)

    managers = SystemManager.objects.select_related('user').all()
    serializer = SystemManagerReadSerializer(managers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetSystemManagerById(request, pk):
    try:
        manager = SystemManager.objects.select_related('user').get(pk=pk)
    except SystemManager.DoesNotExist:
        return Response({"error": "System manager not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = SystemManagerReadSerializer(manager)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def UpdateSystemManager(request, pk):
    if request.user.role != 'admin':
        return Response({"error": "You do not have permission to update managers."}, status=status.HTTP_403_FORBIDDEN)

    try:
        manager = SystemManager.objects.select_related('user').get(pk=pk)
    except SystemManager.DoesNotExist:
        return Response({"error": "System manager not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = SystemManagerSerializer(manager, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteSystemManager(request, pk):
    if request.user.role != 'admin':
        return Response({"error": "You do not have permission to delete managers."}, status=status.HTTP_403_FORBIDDEN)

    try:
        manager = SystemManager.objects.get(pk=pk)
    except SystemManager.DoesNotExist:
        return Response({"error": "System manager not found"}, status=status.HTTP_404_NOT_FOUND)

    manager.user.delete()  # Also deletes the linked User
    return Response({"message": "System manager deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
