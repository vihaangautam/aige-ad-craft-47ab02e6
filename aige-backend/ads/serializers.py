from rest_framework import serializers
from .models import Scene

class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = '__all__'
