# views.py

from django.shortcuts import render
from django.views import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

# Importe o seu modelo Pedido
from ..models import Pedido

# ... (outras views como DashboardView)

@method_decorator(login_required, name='dispatch')
class HistoricoView(View):
    def get(self, request):
        # Pega o parâmetro 'status' da URL para filtrar (ex: ?status=P)
        status_filtro = request.GET.get('status', 'todos')

        # Começa a query buscando todos os pedidos
        # Otimização: select_related('mesa') evita queries extras no banco de dados dentro do loop no template
        pedidos_query = Pedido.objects.select_related('mesa').order_by('-criado_em')

        # Aplica o filtro se um status foi selecionado
        if status_filtro and status_filtro != 'todos':
            pedidos_query = pedidos_query.filter(status=status_filtro)
            
        # Pega as opções de status do modelo para usar no dropdown do template
        status_choices = Pedido.STATUS_CHOICES

        context = {
            # Passa os pedidos filtrados para o template (limitado aos 50 mais recentes)
            'pedidos': pedidos_query[:50], 
            'status_choices': status_choices,
        }
        return render(request, 'login/DashboardAtendente.html', context)

# ... (outras views)