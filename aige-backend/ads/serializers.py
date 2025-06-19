from rest_framework import serializers
from .models import Scene, AdConfiguration, UserProfile

class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = '__all__'

class AdConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdConfiguration
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
