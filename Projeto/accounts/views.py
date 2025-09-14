from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    form = AuthenticationForm(request, data=request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.get_user()
        login(request, user)
        # guarda o tipo na sessão
        role = getattr(getattr(user, 'profile', None), 'role', None)
        request.session['role'] = role
        return redirect('dashboard')

    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def dashboard(request):
    # página branca mostrando o tipo de login
    #role = request.session.get('role', 'ATENDENTE')   fallback 
    #return render(request, 'accounts/dashboard.html', {'role': role})  
     
    role = request.session.get('role', 'ATENDENTE')

    if role == 'GERENTE':
        return dashboard_manager(request)
    else:
        return dashboard_attendant(request) 

@login_required
def dashboard_attendant(request):
    return render(request, 'accounts/dashboard_attendant.html')

@login_required
def dashboard_manager(request):
    return render(request, 'accounts/dashboard_manager.html')


class LoginAPI(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={
                'request': request
            }
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        role = getattr(getattr(user, 'profile', None), 'role', None)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'role': role
        })