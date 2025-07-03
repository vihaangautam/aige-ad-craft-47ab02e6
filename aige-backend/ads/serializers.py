from rest_framework import serializers
from .models import Scene, AdConfiguration, UserProfile, GeneratedScript

class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = '__all__'

class AdConfigurationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = AdConfiguration
        fields = ['id', 'user', 'theme_prompt', 'tone', 'characters_or_elements', 'enable_ar_filters', 'include_mini_game', 'created_at', 'nodes', 'edges']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class GeneratedScriptSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = GeneratedScript
        fields = '__all__'
