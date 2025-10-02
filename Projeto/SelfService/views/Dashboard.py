from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.contrib import messages
from django.urls import reverse
from datetime import timedelta

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
        # Pega os filtros da URL (status e agora o período)
        status_filtro = request.GET.get('status', 'todos')
        periodo_filtro = request.GET.get('periodo', 'todos') # Novo filtro

        # Começa a query base, já otimizada
        pedidos_query = Pedido.objects.select_related('mesa').order_by('-criado_em')

        # 1. Aplica o filtro de STATUS
        if status_filtro and status_filtro != 'todos':
            pedidos_query = pedidos_query.filter(status=status_filtro)

        # 2. Aplica o filtro de PERÍODO (Nova Lógica)
        hoje = timezone.localdate()

        if periodo_filtro == 'hoje':
            pedidos_query = pedidos_query.filter(criado_em__date=hoje)
        elif periodo_filtro == 'ontem':
            ontem = hoje - timedelta(days=1)
            pedidos_query = pedidos_query.filter(criado_em__date=ontem)
        elif periodo_filtro == '7dias':
            sete_dias_atras = hoje - timedelta(days=7)
            # __gte significa "maior ou igual a" (greater than or equal to)
            pedidos_query = pedidos_query.filter(criado_em__date__gte=sete_dias_atras)

        # Pega as opções de status para o dropdown do template
        status_choices = Pedido.STATUS_CHOICES

        context = {
            'pedidos': pedidos_query[:100], # Aumentei o limite para 100
            'status_choices': status_choices,
            'status_filtro_atual': status_filtro,   # Envia o filtro atual de volta
            'periodo_filtro_atual': periodo_filtro, # Envia o filtro atual de volta
        }
        return render(request, 'login/DashboardAtendente.html', context)






















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
