from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ServiceProviderSerializer

@api_view(['POST'])
def NewServiceProvider(request):
    serializer = ServiceProviderSerializer(data=request.data)
    if serializer.is_valid():
        service_provider = serializer.save()
        return Response(ServiceProviderSerializer(service_provider).data, status=status.HTTP_201_CREATED)
    else:
        # If validation fails, return a simple custom error
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
