from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.contrib import messages
from django.urls import reverse

from ..models import Mesa, Pedido

@method_decorator(login_required, name='dispatch')
class DashboardView(View):
    def get(self, request):
        role = request.session.get('role', 'ATENDENTE')
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
        tab = request.GET.get('tab', 'today')

        hoje = timezone.localdate()
        pedidos_hoje = (Pedido.objects
                        .filter(criado_em__date=hoje)
                        .select_related('mesa')
                        .order_by('-criado_em'))
        total_pedidos = pedidos_hoje.count()
        total_faturado = sum(
            (p.total() or 0) for p in pedidos_hoje if p.status in ('C', 'F')
        )

        mesas = Mesa.objects.all().order_by('numero')

        ctx = {
            'tab': tab,
            'mesas': mesas,
            'pedidos_hoje': pedidos_hoje,
            'total_pedidos': total_pedidos,
            'total_faturado': total_faturado,
            'hoje': hoje,
        }
        return render(request, 'login/DashboardGerente.html', ctx)

    def post(self, request):
        action = request.POST.get('action')

        if action == 'toggle_mesa':
            mesa_id = request.POST.get('mesa_id')
            mesa = get_object_or_404(Mesa, id=mesa_id)
            mesa.ocupada = not mesa.ocupada
            mesa.save()
            messages.success(request, f"Estado da Mesa {mesa.numero} atualizado para "
                                      f"{'ocupada' if mesa.ocupada else 'livre'}.")
            return redirect(request.META.get('HTTP_REFERER', 'dashboardGerente'))

        if action == 'add_mesa':
            try:
                numero = int(request.POST.get('numero'))
                capacidade = int(request.POST.get('capacidade', 4))
            except (TypeError, ValueError):
                messages.error(request, "Informe número e capacidade válidos.")
                return redirect('dashboardGerente')

            if Mesa.objects.filter(numero=numero).exists():
                messages.error(request, f"Já existe a Mesa {numero}.")
            else:
                Mesa.objects.create(numero=numero, capacidade=capacidade, ocupada=False)
                messages.success(request, f"Mesa {numero} criada com sucesso.")
            url = f"{reverse('dashboardGerente')}?tab=mesas"
            return redirect(url)

        messages.error(request, "Ação inválida.")
        return redirect('dashboardGerente')
