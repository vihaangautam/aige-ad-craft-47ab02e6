from django.apps import AppConfig

class AdsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'  # type: ignore
    name = 'ads'

    def ready(self):
        import ads.signals
