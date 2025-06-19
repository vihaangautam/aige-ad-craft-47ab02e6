from .models import Scene, AdConfiguration
from .serializers import SceneSerializer, AdConfigurationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets


class SceneViewSet(viewsets.ModelViewSet):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = [IsAuthenticated]

class AdConfigurationViewSet(viewsets.ModelViewSet):
    queryset = AdConfiguration.objects.all()
    serializer_class = AdConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return AdConfiguration.objects.filter(user=self.request.user)
