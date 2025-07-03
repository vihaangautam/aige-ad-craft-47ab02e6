from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('ads', '0007_alter_adconfiguration_user_alter_scene_user_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE ads_adconfiguration DROP COLUMN IF EXISTS slug;",
            reverse_sql="ALTER TABLE ads_adconfiguration ADD COLUMN slug varchar(255);"
        ),
    ] 