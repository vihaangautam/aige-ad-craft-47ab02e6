from rest_framework import viewsets
from .models import Scene
from .serializers import SceneSerializer

class SceneViewSet(viewsets.ModelViewSet):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
