from django.shortcuts import render
from .models import Pedido

def painel_atendente(request):
    filtro = request.GET.get("filtro", "todas")

    pedidos = Pedido.objects.all()

    if filtro == "ocupadas":
        pedidos = pedidos.filter(mesa__status="ocupada")
    elif filtro == "reservadas":
        pedidos = pedidos.filter(mesa__status="reservada")
    elif filtro == "pedidos":
        pedidos = pedidos.exclude(status="entregue")

    return render(request, "painel_atendente.html", {
        "pedidos": pedidos,
        "filtro": filtro
    })
