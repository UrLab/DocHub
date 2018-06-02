from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_auto_20180325_1317'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_staff',
            new_name='is_superuser',
        ),
    ]
