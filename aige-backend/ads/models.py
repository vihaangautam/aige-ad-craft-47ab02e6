from django.db import models

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
    theme_prompt = models.TextField()
    tone = models.CharField(max_length=100)
    characters_or_elements = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)