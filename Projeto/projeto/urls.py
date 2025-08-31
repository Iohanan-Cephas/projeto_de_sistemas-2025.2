from django.contrib import admin
from django.urls import path
from accounts.views import login_view, logout_view, dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('', dashboard, name='dashboard'),
]
