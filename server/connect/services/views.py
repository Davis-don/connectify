from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ServiceCategory, Service
from .serializers import ServiceCategorySerializer, ServiceSerializer


# =====================================================
# 🔽 SERVICE CATEGORY VIEWS
# =====================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def GetServiceCategories(request):
    categories = ServiceCategory.objects.all()
    serializer = ServiceCategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreateServiceCategory(request):
    serializer = ServiceCategorySerializer(data=request.data)
    if serializer.is_valid():
        category = serializer.save()
        return Response(
            ServiceCategorySerializer(category).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def UpdateServiceCategory(request, pk):
    try:
        category = ServiceCategory.objects.get(pk=pk)
    except ServiceCategory.DoesNotExist:
        return Response(
            {"error": "Service category not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ServiceCategorySerializer(
        category,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteServiceCategory(request, pk):
    try:
        category = ServiceCategory.objects.get(pk=pk)
    except ServiceCategory.DoesNotExist:
        return Response(
            {"error": "Service category not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    category.delete()
    return Response(
        {"message": "Service category deleted successfully"},
        status=status.HTTP_200_OK  # Change from 204_NO_CONTENT to 200_OK
    )


# =====================================================
# 🔽 GET SERVICE CATEGORY BY ID
# =====================================================
@api_view(['GET'])
@permission_classes([AllowAny])
def GetServiceCategoryById(request, pk):
    try:
        category = ServiceCategory.objects.get(pk=pk)
    except ServiceCategory.DoesNotExist:
        return Response(
            {"error": "Service category not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ServiceCategorySerializer(category)
    return Response(serializer.data, status=status.HTTP_200_OK)

# =====================================================
# 🔽 SERVICE VIEWS
# =====================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def GetServices(request):
    services = Service.objects.select_related("category").all()

    category_id = request.query_params.get("category")
    if category_id:
        services = services.filter(category_id=category_id)

    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreateService(request):
    serializer = ServiceSerializer(data=request.data)
    if serializer.is_valid():
        service = serializer.save()
        return Response(
            ServiceSerializer(service).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def UpdateService(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response(
            {"error": "Service not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ServiceSerializer(
        service,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteService(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response(
            {"error": "Service not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    service.delete()
    return Response(
        {"message": "Service deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )


# =====================================================
# 🔽 GET SERVICE BY ID
# =====================================================
@api_view(['GET'])
@permission_classes([AllowAny])
def GetServiceById(request, pk):
    try:
        service = Service.objects.select_related("category").get(pk=pk)
    except Service.DoesNotExist:
        return Response(
            {"error": "Service not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ServiceSerializer(service)
    return Response(serializer.data, status=status.HTTP_200_OK)
