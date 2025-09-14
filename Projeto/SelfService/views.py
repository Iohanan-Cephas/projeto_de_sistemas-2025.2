from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, get_object_or_404, redirect
from .models import Mesa, Pedido, ItemCardapio, ItemPedido
from rest_framework.generics import ListCreateAPIView
from .serializers import SerializerMesa

# Lista todas as mesas


def lista_mesas(request):
    mesas = Mesa.objects.all()
    return render(request, 'SelfService/lista_mesas.html', {'mesas': mesas})

# Detalhe da mesa e pedidos


def detalhe_mesa(request, mesa_id):
    mesa = get_object_or_404(Mesa, id=mesa_id)
    pedidos = mesa.pedidos.all()
    return render(request, 'SelfService/detalhe_mesa.html', {'mesa': mesa, 'pedidos': pedidos})

# Adicionar pedido à mesa


def adicionar_pedido(request, mesa_id):
    mesa = get_object_or_404(Mesa, id=mesa_id)
    itens = ItemCardapio.objects.all()

    if request.method == 'POST':
        pedido = Pedido.objects.create(mesa=mesa)
        for item_id, quantidade in request.POST.items():
            if item_id.startswith('item_') and int(quantidade) > 0:
                item = ItemCardapio.objects.get(id=int(item_id.split('_')[1]))
                ItemPedido.objects.create(
                    pedido=pedido, item=item, quantidade=int(quantidade))
        return redirect('detalhe_mesa', mesa_id=mesa.id)

    return render(request, 'SelfService/adicionar_pedido.html', {'mesa': mesa, 'itens': itens})

# API Mesas


class APIListarMesas(ListCreateAPIView):
    serializer_class = SerializerMesa

    def get_queryset(self):
        return Mesa.objects.all()
