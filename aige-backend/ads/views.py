from rest_framework import viewsets
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Scene, AdConfiguration, GeneratedScript
from .serializers import SceneSerializer, AdConfigurationSerializer
from .utils import build_ai_prompt, call_gemini_or_gpt
from django.conf import settings
import os
from django.core.files.storage import default_storage

# ----------- SCENE VIEWSET -----------
class SceneViewSet(viewsets.ModelViewSet):
    serializer_class = SceneSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scene.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ----------- CONFIG VIEWSET -----------
class AdConfigurationViewSet(viewsets.ModelViewSet):
    serializer_class = AdConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdConfiguration.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ----------- SCRIPT GENERATION -----------
class ScriptGenerationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        config = request.data.get("config")
        flow = request.data.get("flow")

        if not config or not flow:
            return Response({"error": "Missing config or flow"}, status=400)

        try:
            prompt = build_ai_prompt(config, flow)
            script = call_gemini_or_gpt(prompt)

            GeneratedScript.objects.create(
                user=request.user,
                config=config,
                flow=flow,
                script=script
            )

            return Response({"script": script})

        except Exception as e:
            return Response({"error": str(e)}, status=500)

# ----------- VIDEO UPLOAD ENDPOINT -----------
class VideoUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=400)
        # Save the file to MEDIA_ROOT/videos/
        file_path = default_storage.save(f'videos/{file_obj.name}', file_obj)
        video_url = f"{settings.MEDIA_URL}videos/{file_obj.name}"
        return Response({'video_url': video_url}, status=201)