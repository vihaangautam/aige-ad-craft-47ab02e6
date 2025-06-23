from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Scene, AdConfiguration
from .serializers import SceneSerializer, AdConfigurationSerializer
from .utils import build_ai_prompt, call_gemini_or_gpt  # Make sure ai.py is in your ads/ folder

class SceneViewSet(viewsets.ModelViewSet):
    serializer_class = SceneSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scene.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdConfigurationViewSet(viewsets.ModelViewSet):
    serializer_class = AdConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdConfiguration.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ✅ FIX: Add this
class ScriptGenerationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        config = request.data.get("config")
        flow = request.data.get("flow")

        if not config or not flow:
            return Response({"error": "Missing config or flow"}, status=400)

        prompt = build_ai_prompt(config, flow)
        script = call_gemini_or_gpt(prompt)

        return Response({"script": script})
