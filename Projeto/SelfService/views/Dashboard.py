from django.views import View
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

@method_decorator(login_required, name='dispatch')
class DashboardView(View):
    def get(self, request):
        role = request.session.get('role', 'ATENDENTE')
        print(">>> ROLE LIDO NA SESSÃO:", role)  # DEBUG
        if role == 'GERENTE':
            return redirect('dashboardGerente')
        return redirect('dashboardAtendente')

@method_decorator(login_required, name='dispatch')
class DashboardAttendantView(View):
    def get(self, request):
        return render(request, 'login/DashboardAtendente.html')


@method_decorator(login_required, name='dispatch')
class DashboardManagerView(View):
    def get(self, request):
        return render(request, 'login/DashboardGerente.html')
