from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Scene, AdConfiguration, UserProfile, GeneratedScript

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

# Unregister original and re-register with profile inline
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(Scene)
class SceneAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'label_a', 'label_b', 'created_at')

@admin.register(AdConfiguration)
class AdConfigurationAdmin(admin.ModelAdmin):
    list_display = ('id', 'theme_prompt', 'tone', 'enable_ar_filters', 'include_mini_game', 'created_at')

@admin.register(GeneratedScript)
class GeneratedScriptAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at')
    readonly_fields = ('config', 'flow', 'script')

admin.site.register(UserProfile)
