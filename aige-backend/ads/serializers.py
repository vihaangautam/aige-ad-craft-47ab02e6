from rest_framework import serializers
from .models import Scene
from .models import AdConfiguration

class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = '__all__'
        
class AdConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdConfiguration
        fields = '__all__'