# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from dbhack.models import Company, Stock, User, Transaction


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
            'data': data_points
        }
        payload.append(company_payload)

    return JsonResponse(payload, safe=False)


def get_company_data(request, company_id, *args, **kwargs):
    return get_all_company_data(request, only_pk=company_id)


def get_portfolio(request, user_id, *args, **kwargs):
    user = User.objects.get(pk=user_id)
    transactions = []
    for transaction in user.transactions.all().order_by('-timestamp'):
        transactions.append({
            'time': str(transaction.timestamp),
            'company': str(transaction.company),
            'value_at_buy': str(transaction.value_at_buy),
            'wfi_at_buy': str(transaction.wfi_at_buy),
            'block_address': str(transaction.block_address)
        })
    payload = {
        'transactions': transactions
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
    assert(quantity > 0)
    assert(value_at_buy > 0)

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
        return JsonResponse({'error': 'unknown user'})

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

    try:
        csv_file = request.FILES["upload"]
    except:
        return JsonResponse({'error': 'error with the file uploaded'})
    if not csv_file.name.endswith('.csv'):
        return JsonResponse({'error': 'file has wrong format'})

    file_data = csv_file.read().decode("utf-8")
    print(file_data)

    return JsonResponse({'success': 'ok'})

