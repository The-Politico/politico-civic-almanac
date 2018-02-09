# Generated by Django 2.0.2 on 2018-02-09 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('almanac', '0004_auto_20180207_1839'),
    ]

    operations = [
        migrations.AddField(
            model_name='electionevent',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='electionevent',
            name='event_type',
            field=models.CharField(choices=[('Primaries', 'Primaries'), ('Primaries Runoff', 'Primaries Runoff'), ('General', 'General'), ('General Runoff', 'General Runoff'), ('Special Primary', 'Special Primary'), ('Special Runoff', 'Special Runoff'), ('Special General', 'Special General')], max_length=50),
        ),
    ]
