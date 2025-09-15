from django.views import View
from django.shortcuts import render, get_object_or_404
from ..models import Mesa

class ListaMesasView(View):
    def get(self, request):
        mesas = Mesa.objects.all()
        return render(request, 'SelfService/lista_mesas.html', {'mesas': mesas})


class DetalheMesaView(View):
    def get(self, request, mesa_id):
        mesa = get_object_or_404(Mesa, id=mesa_id)
        pedidos = mesa.pedidos.all()
        return render(request, 'SelfService/detalhe_mesa.html', {'mesa': mesa, 'pedidos': pedidos})
