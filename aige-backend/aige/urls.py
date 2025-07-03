from django.contrib import admin
from django.urls import path, include
from ads.views import ScriptGenerationView
from rest_framework.routers import DefaultRouter
from ads.views import SceneViewSet, AdConfigurationViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'scenes', SceneViewSet, basename='scene')
router.register(r'configs', AdConfigurationViewSet, basename='config')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/generate-script/", ScriptGenerationView.as_view(), name="generate-script"),
    path('ads/', include('ads.urls')),
]

if settings.DEBUG:
       urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

