"""bonnback URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from dbhack.views import get_all_company_data, get_company_data, get_portfolio, post_transaction, post_data, \
    post_login_user, post_login_company

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^companydata/$', get_all_company_data, name='get_all_company_data'),
    url(r'^companydata/(?P<company_id>[0-9]+)$', get_company_data, name='get_company_data'),
    url(r'^portfolio/(?P<user_id>[0-9]+)$', get_portfolio, name='get_portfolio'),
    url(r'^transaction/$', post_transaction, name='post_transaction'),
    url(r'^userlogin/$', post_login_user, name='post_login_user'),
    url(r'^companylogin/$', post_login_company, name='post_login_company'),
    url(r'^upload/$', post_data, name='post_data'),
]
