from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0002_auto_20150613_1516'),
        ('users', '0004_remove_user_followed_courses'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='moderated_courses',
            field=models.ManyToManyField(to='catalog.Course'),
            preserve_default=True,
        ),
    ]
