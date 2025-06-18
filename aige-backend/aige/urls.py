from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ads.views import SceneViewSet
from ads.views import AdConfigurationViewSet


router = DefaultRouter()
router.register(r'scenes', SceneViewSet)
router.register(r'configs', AdConfigurationViewSet)  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
