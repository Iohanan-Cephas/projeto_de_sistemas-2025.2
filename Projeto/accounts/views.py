from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages

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
    role = request.session.get('role', 'ATENDENTE')  # fallback
    return render(request, 'accounts/dashboard.html', {'role': role})
