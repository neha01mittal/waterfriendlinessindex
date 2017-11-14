# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class User(models.Model):
    name = models.CharField(max_length=256)
    credit = models.FloatField()

    def __str__(self):
        return self.name


class Transaction(models.Model):
    timestamp = models.DateTimeField(auto_now=True)

    user = models.ForeignKey('User', related_name='transactions')
    company = models.ForeignKey('Company', related_name='transactions')

    value_at_buy = models.FloatField()
    wfi_at_buy = models.FloatField()
    quantity = models.PositiveIntegerField()
    was_a_buy = models.BooleanField(default=False)

    block_address = models.CharField(max_length=128)

    def __str__(self):
        return "{} bought {} share of {}".format(self.user, self.quantity, self.company)


class Company(models.Model):
    name = models.CharField(max_length=128)
    is_supplier = models.BooleanField(default=False)
    image_path = models.CharField(max_length=1024)
    text = models.TextField(null=True)
    focus_area = models.CharField(max_length=64)

    def __str__(self):
        return self.name


class Stock(models.Model):
    timestamp = models.DateTimeField(auto_now=True)

    company = models.ForeignKey('Company', related_name='stocks')

    valuation = models.FloatField()
    wfi = models.PositiveSmallIntegerField()
    text = models.CharField(max_length=256)

    block_address = models.CharField(max_length=128)

    def __str__(self):
        return "{} WFI={} VAL={}".format(self.company, self.wfi, self.valuation)

