from rest_framework import viewsets
from .models import Scene
from .serializers import SceneSerializer
from .models import AdConfiguration
from .serializers import AdConfigurationSerializer

class SceneViewSet(viewsets.ModelViewSet):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer

class AdConfigurationViewSet(viewsets.ModelViewSet):
    queryset = AdConfiguration.objects.all()
    serializer_class = AdConfigurationSerializer
