from django.views import View
from django.shortcuts import render, get_object_or_404, redirect
from ..models import Mesa, Pedido, ItemCardapio, ItemPedido

class AdicionarPedidoView(View):
    def get(self, request, mesa_id):
        mesa = get_object_or_404(Mesa, id=mesa_id)
        itens = ItemCardapio.objects.all()
        return render(request, 'SelfService/adicionar_pedido.html', {'mesa': mesa, 'itens': itens})

    def post(self, request, mesa_id):
        mesa = get_object_or_404(Mesa, id=mesa_id)
        pedido = Pedido.objects.create(mesa=mesa)
        for item_id, quantidade in request.POST.items():
            if item_id.startswith('item_') and int(quantidade) > 0:
                item = ItemCardapio.objects.get(id=int(item_id.split('_')[1]))
                ItemPedido.objects.create(pedido=pedido, item=item, quantidade=int(quantidade))
        return redirect('detalhe_mesa', mesa_id=mesa.id)


class PedidosPorMesaView(View):
    def get(self, request):
        mesas = Mesa.objects.all().order_by('numero')
        dados = []
        for m in mesas:
            pedidos = m.pedidos.order_by('-criado_em').all()
            dados.append({'mesa': m, 'pedidos': pedidos})
        return render(request, 'SelfService/pedidos_por_mesa.html', {'mesas_pedidos': dados})
