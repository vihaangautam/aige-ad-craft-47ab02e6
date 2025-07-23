from rest_framework import viewsets
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Scene, AdConfiguration, GeneratedScript
from .serializers import SceneSerializer, AdConfigurationSerializer
from .utils import build_ai_prompt, call_gemini_or_gpt
from django.conf import settings
import os
from django.core.files.storage import default_storage
import json
import re
from rest_framework import status
import random
import requests

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

        print('Received config:', config)
        print('Received flow:', flow)

        if not config or not flow:
            print('Missing config or flow in request!')
            return Response({"error": "Missing config or flow"}, status=400)

        try:
            prompt = build_ai_prompt(config, flow)
            print('Generated prompt:', prompt)
        except Exception as e:
            print('Error building prompt:', e)
            return Response({"error": f"Error building prompt: {e}"}, status=500)

        try:
            script = call_gemini_or_gpt(prompt)
            print('Raw generated script:', script)
            # Robustly remove markdown/code block markers before parsing
            if isinstance(script, str):
                script = script.strip()
                # Remove leading/trailing code block markers (```json, ```, etc.)
                script = re.sub(r'^```json\s*', '', script, flags=re.IGNORECASE)
                script = re.sub(r'^```\s*', '', script)
                script = re.sub(r'```\s*$', '', script)
                script = script.strip()
                try:
                    parsed = json.loads(script)
                    if not isinstance(parsed, list):
                        print('Script is not a list after parsing:', parsed)
                        parsed = []
                    script = parsed
                except Exception as e:
                    print('Failed to parse script JSON after generation:', e)
                    script = []
            if not script:
                print('Script is empty after generation!')
                return Response({"error": "Script generation returned empty script"}, status=500)
            print('✅ Final script to save:', script)
        except Exception as e:
            print('Error generating script:', e)
            return Response({"error": f"Error generating script: {e}"}, status=500)

        try:
            GeneratedScript.objects.create(
                user=request.user,
                config=config,
                flow=flow,
                script=json.dumps(script)  # Save as JSON string
            )
        except Exception as e:
            print('Error saving script:', e)
            return Response({"error": f"Error saving script: {e}"}, status=500)

        return Response({"script": script})

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

# ----------- LATEST SCRIPT ENDPOINT -----------
class LatestScriptView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        latest = GeneratedScript.objects.filter(user=request.user).order_by('-created_at').first()
        if not latest:
            return Response({'script': []})
        script = latest.script
        if isinstance(script, str):
            try:
                script = script.strip()
                if script.startswith('~~~json'):
                    script = script[7:]
                script = script.strip()
                script = json.loads(script)
            except Exception as e:
                print('Failed to parse script JSON:', e)
                script = []
        print('🟡 Returning script to frontend:', script)
        return Response({'script': script})

class StatusView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        operation_id = request.data.get("operation_id")
        if not operation_id:
            return Response({"error": "Missing operation_id"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            resp = requests.post(
                "http://ai-aige.asiavilleservice.com/status",
                json={"operation_id": operation_id},
                headers={"Content-Type": "application/json"}
            )
            return Response(resp.json(), status=resp.status_code)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerateVideoView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        prompt = request.data.get("prompt")
        if not prompt:
            return Response({"error": "Missing prompt"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Call the REAL video generation endpoint (not /status)
            resp = requests.post(
                "http://ai-aige.asiavilleservice.com/generatev1",
                json={"prompt": prompt},
                headers={"Content-Type": "application/json"}
            )
            return Response(resp.json(), status=resp.status_code)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
