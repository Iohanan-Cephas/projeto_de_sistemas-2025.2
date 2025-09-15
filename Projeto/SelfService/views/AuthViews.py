from django.views import View
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm

class LoginView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect('dashboard')
        form = AuthenticationForm()
        return render(request, 'login/Login.html', {'form': form})

    def post(self, request):
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            role = getattr(getattr(user, 'profile', None), 'role', 'ATENDENTE')
            request.session['role'] = role.upper()

            print(">>> ROLE SALVO NA SESSÃO:", request.session['role'])
            return redirect('dashboard')
        return render(request, 'login/Login.html', {'form': form})


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('login')
