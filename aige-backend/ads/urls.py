# ads/urls.py
from django.urls import path
from .views import VideoUploadView

urlpatterns = [
    path('upload_video/', VideoUploadView.as_view(), name='upload_video'),
]