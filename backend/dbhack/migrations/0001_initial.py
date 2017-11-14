# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-14 13:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('is_supplier', models.BooleanField(default=False)),
                ('image_path', models.CharField(max_length=1024)),
                ('text', models.TextField(null=True)),
                ('focus_area', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('valuation', models.FloatField()),
                ('wfi', models.PositiveSmallIntegerField()),
                ('text', models.CharField(max_length=256)),
                ('block_address', models.CharField(max_length=128)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stocks', to='dbhack.Company')),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('value_at_buy', models.FloatField()),
                ('quantity', models.PositiveIntegerField()),
                ('was_a_buy', models.BooleanField(default=False)),
                ('block_address', models.CharField(max_length=128)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='dbhack.Company')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('credit', models.FloatField()),
            ],
        ),
        migrations.AddField(
            model_name='transaction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='dbhack.User'),
        ),
    ]
