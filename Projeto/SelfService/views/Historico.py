from django.views import View
from django.shortcuts import render
from ..models import Pedido

class HistoricoPedidosView(View):
    def get(self, request):
        status = request.GET.get("status")
        q = request.GET.get("q")

        # começa com todos os pedidos (mais recentes primeiro)
        pedidos = Pedido.objects.select_related("mesa", "mesa__atendente").order_by("-criado_em")

        # filtro por status de pedido
        if status and status != "todos":
            pedidos = pedidos.filter(status=status)

        # filtro por busca (ex: mesa, id do pedido, atendente)
        if q:
            pedidos = pedidos.filter(
                models.Q(id__icontains=q) |
                models.Q(mesa__numero__icontains=q) |
                models.Q(atendente__username__icontains=q)
            )

        return render(request, "SelfService/historico.html", {"pedidos": pedidos})
