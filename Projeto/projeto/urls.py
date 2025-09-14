from django.contrib import admin
from django.urls import path, include
from accounts.views import dashboard, login_view, logout_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('', dashboard, name='dashboard'),
    path('SelfService/', include('SelfService.urls')),
]
