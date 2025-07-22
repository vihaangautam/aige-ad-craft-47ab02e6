# ads/urls.py
from django.urls import path
from .views import VideoUploadView, LatestScriptView, MockStatusView, GenerateVideoView

urlpatterns = [
    path('upload_video/', VideoUploadView.as_view(), name='upload_video'),
    path('get-latest-script/', LatestScriptView.as_view(), name='get_latest_script'),
    path('status/', MockStatusView.as_view(), name='status'),
    path('generate-video/', GenerateVideoView.as_view(), name='generate_video'),
]