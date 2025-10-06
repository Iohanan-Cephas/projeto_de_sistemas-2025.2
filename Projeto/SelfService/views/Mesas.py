# views.py
from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from ..models import Mesa

class ListaMesasView(View):
    template_name = 'SelfService/lista_mesas.html'

    def get(self, request):
        mesas = Mesa.objects.prefetch_related('pedidos')
        return render(request, self.template_name, {'mesas': mesas})

    def post(self, request):
        action = request.POST.get('action')

        if action == 'add_mesa':
            try:
                numero = int(request.POST.get('numero'))
                capacidade = int(request.POST.get('capacidade'))
            except (TypeError, ValueError):
                messages.error(request, 'Preencha número e capacidade corretamente.')
                return redirect('lista_mesas')

            Mesa.objects.create(numero=numero, capacidade=capacidade)
            messages.success(request, f'Mesa {numero} adicionada.')
            return redirect('lista_mesas')

        elif action == 'toggle_mesa':
            mesa = get_object_or_404(Mesa, pk=request.POST.get('mesa_id'))
            mesa.ocupada = not mesa.ocupada
            mesa.save()
            messages.success(request, f'Mesa {mesa.numero} marcada como {"ocupada" if mesa.ocupada else "livre"}.')
            return redirect('lista_mesas')

        messages.error(request, 'Ação inválida.')
        return redirect('lista_mesas')


class DetalheMesaView(View):
    def get(self, request, mesa_id):
        mesa = get_object_or_404(Mesa, id=mesa_id)
        pedidos = mesa.pedidos.all()
        return render(request, 'SelfService/detalhe_mesa.html', {'mesa': mesa, 'pedidos': pedidos})
