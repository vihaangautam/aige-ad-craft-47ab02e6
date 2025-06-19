from django.db import models
from django.contrib.auth.models import User

class Scene(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    video_url_a = models.URLField(blank=True)
    label_a = models.CharField(max_length=255, blank=True)
    next_scene_a = models.ForeignKey('self', null=True, blank=True, related_name='next_from_a', on_delete=models.SET_NULL)

    video_url_b = models.URLField(blank=True)
    label_b = models.CharField(max_length=255, blank=True)
    next_scene_b = models.ForeignKey('self', null=True, blank=True, related_name='next_from_b', on_delete=models.SET_NULL)

    created_at = models.DateTimeField(auto_now_add=True)

class AdConfiguration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
  # 🔐 Link to user
    theme_prompt = models.TextField()
    tone = models.CharField(max_length=100)
    characters_or_elements = models.TextField(blank=True)

    enable_ar_filters = models.BooleanField(default=False)
    include_mini_game = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    is_creator = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
