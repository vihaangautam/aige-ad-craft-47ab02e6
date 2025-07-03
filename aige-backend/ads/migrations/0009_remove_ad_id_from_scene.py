from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('ads', '0008_remove_slug_from_adconfiguration'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE ads_scene DROP COLUMN IF EXISTS ad_id;",
            reverse_sql="ALTER TABLE ads_scene ADD COLUMN ad_id integer;",
        ),
    ] 