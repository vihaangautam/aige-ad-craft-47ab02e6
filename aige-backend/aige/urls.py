from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ads.views import SceneViewSet

router = DefaultRouter()
router.register(r'scenes', SceneViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
