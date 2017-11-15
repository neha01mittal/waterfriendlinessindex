# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from collections import defaultdict

import datetime
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from dbhack.models import Company, Stock, User, Transaction, Stock


def get_all_company_data(request, only_pk=None, *args, **kwargs):
    if only_pk is not None:
        qs = Company.objects.filter(pk=only_pk)
    else:
        qs = Company.objects.all()
    payload = []
    for company in qs.iterator():
        data_points = []
        for stock in company.stocks.all().order_by('-timestamp'):
            data_points.append(
                {'time': str(stock.timestamp),
                 'val': float(stock.valuation),
                 'wfi': int(stock.wfi)}
            )
        company_payload = {
            'logo': str(company.image_path),
            'name': str(company.name),
            'data': data_points,
            'id': int(company.pk)
        }
        payload.append(company_payload)

    return JsonResponse(payload, safe=False)


def get_company_data(request, company_id, *args, **kwargs):
    return get_all_company_data(request, only_pk=company_id)


def get_portfolio(request, user_id, *args, **kwargs):
    user = User.objects.get(pk=user_id)

    # calculate the latest valuations
    company_valuations = {}

    for company in Company.objects.iterator():
        try:
            company_valuations[str(company.name)] = {
                'latest_valuation': company.stocks.latest('timestamp').valuation,
                'value': 0,
                'quantity': 0
            }

        except Stock.DoesNotExist:
            company_valuations[str(company.name)] = 0

    transactions = []
    accu = 0
    for transaction in user.transactions.all().order_by('-timestamp'):
        accu += transaction.quantity * transaction.value_at_buy
        transactions.append({
            'time': str(transaction.timestamp),
            'company': str(transaction.company),
            'value_at_buy': str(transaction.value_at_buy),
            'wfi_at_buy': str(transaction.wfi_at_buy),
            'block_address': str(transaction.block_address),
            'quantity': int(transaction.quantity),
            'accumulation': accu
        })
        company_valuations[str(transaction.company.name)]['value'] += transaction.quantity * company_valuations[transaction.company.name]['latest_valuation']
        company_valuations[str(transaction.company.name)]['quantity'] += transaction.quantity

    # make company_valuations flat
    assets = []
    for key in company_valuations.keys():
        if company_valuations[key] == 0:
            continue

        if company_valuations[key]['value'] == 0:
            continue
        assets.append({
            'name': key,
            'value': company_valuations[key]['value'],
            'quantity': company_valuations[key]['quantity'],
            'latest_valuation': company_valuations[key]['latest_valuation']
        })

    # remove the zero elements
    #company_valuations = filter(lambda x: x != 0, company_valuations[str(company.name)])

    payload = {
        'transactions': transactions,
        #'assets': company_valuations
        'assets': assets
    }
    return JsonResponse(payload, safe=False)


@csrf_exempt
def post_transaction(request, *args, **kwargs):
    if request.method != 'POST':
        return JsonResponse({'error': 'only POST allowed'})
    try:
        quantity = int(request.POST.get('quantity'))
        value_at_buy = float(request.POST.get('value_at_buy'))
    except:
        return JsonResponse({'error': 'invalid quantity or value_at_buy'})

    try:
        company_id = request.POST.get('company_id')
        company = Company.objects.get(pk=company_id)
    except:
        return JsonResponse({'error': 'invalid company'})

    try:
        user_id = request.POST.get('user_id')
        user = User.objects.get(pk=user_id)
    except:
        return JsonResponse({'error': 'invalid user'})

    block_address = request.POST.get('block_address')

    # make assertions
    try:
        assert(value_at_buy > 0)
        assert(quantity != 0)
    except AssertionError:
        return JsonResponse({'error': 'value_at_buy is 0'})

    if quantity < 0:
        # check if the user has enough coins for this
        users_coins = user.coins_of(company)
        print("USER COINS {}".format(users_coins))
        if abs(quantity) > users_coins:
            return JsonResponse({'error': 'not enough coins to sale'})
        price = quantity * company.stocks.latest('timestamp').valuation
    else:
        price = quantity * value_at_buy
        if price > user.credit:
            return JsonResponse({'error': 'not enough cash'})

    # substract the money
    user.credit -= price
    user.save()

    # create the transaction
    transaction = Transaction.objects.create(user=user, company=company,
                                             value_at_buy=value_at_buy,
                                             wfi_at_buy=0,#Company.stocks.all().latest('timestamp').wfi,
                                             block_address=block_address,
                                             quantity=quantity)

    return JsonResponse({'credit': user.credit}, safe=False)


@csrf_exempt
def post_login_user(request, *args, **kwargs):
    if request.method != 'POST':
        return JsonResponse({'error': 'only POST allowed'})

    try:
        user_name = request.POST.get('user_name')
        user = User.objects.get(name=user_name)
    except:
        user = User.objects.create(name=user_name, credit=100.0)

    return JsonResponse({'user_id': str(user.pk), 'credit': float(user.credit)})


@csrf_exempt
def post_login_company(request, *args, **kwargs):
    if request.method != 'POST':
        return JsonResponse({'error': 'only POST allowed'})

    try:
        company_name = request.POST.get('company_name')
        company = Company.objects.get(name=company_name)
    except:
        return JsonResponse({'error': 'unknown company'})

    return JsonResponse({'company_id': str(company.pk)})


@csrf_exempt
def post_data(request, *args, **kwargs):
    if request.method != 'POST':
        return JsonResponse({'error': 'only POST allowed'})

    try:
        company_id = request.POST.get('company_id')
        company = Company.objects.get(pk=company_id)
    except:
        return JsonResponse({'error': 'invalid company'})

    # try:
    #     csv_file = request.FILES["upload"]
    # except:
    #     return JsonResponse({'error': 'error with the file uploaded'})
    # if not csv_file.name.endswith('.csv'):
    #     return JsonResponse({'error': 'file has wrong format'})
    #
    # file_data = csv_file.read().decode("utf-8")
    # print(file_data)

    try:
        wfi = float(request.POST.get('wfi', 0.0))
    except:
        return JsonResponse({'error': 'wfi wrong formatted'})

    # is there an older entry?
    try:
        latest_stock = company.stocks.latest('timestamp')
        no_latest_stock = False
    except Stock.DoesNotExist:
        no_latest_stock = True

    if no_latest_stock:
        Stock.objects.create(company=company, valuation=wfi, wfi=wfi, text="Joined the Waterfriends",
                             block_address=request.POST.get('block_address', ' '))
    else:
        # calculate the difference in seconds
        now = datetime.datetime.now()
        # remove the timezone information on both of them and get the timedelte
        delta = now.replace(tzinfo=None) - latest_stock.timestamp.replace(tzinfo=None)
        delta_t = float(delta.total_seconds())
        # get the seconds of the year
        total_seconds = float(365 * 24 * 60 * 60)
        # calculate the fraction of the year
        # this is necessary to not be influenced by the frequency of updates
        time_part = delta_t / total_seconds
        # the earning is the value which is added for the passed period
        # it consists of the first part of the sum which shall be a consistency part
        # and the second part is to incentive increasing the index
        earning = latest_stock.wfi * time_part + (wfi - latest_stock.wfi)
        new_valuation = latest_stock.valuation + earning
        Stock.objects.create(company=company, valuation=new_valuation, text=" ", wfi=wfi,
                             block_address=request.POST.get('block_address', ' '))

    return JsonResponse({'success': 'ok'})

