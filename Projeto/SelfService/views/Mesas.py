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
        
        # Ação para adicionar uma nova mesa
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

        mesa_id = request.POST.get('mesa_id')
        mesa = get_object_or_404(Mesa, pk=mesa_id)

        # Ação para ocupar uma mesa (a partir do estado livre ou reservado)
        if action == 'ocupar_mesa':
            if not mesa.ocupada:
                mesa.ocupada = True
                mesa.reservada = False  # Ocupar cancela a reserva, se houver
                mesa.reservada_por = None
                mesa.reserva_expira_em = None
                mesa.save()
                messages.success(request, f'Mesa {mesa.numero} ocupada.')
            else:
                messages.error(request, 'Esta mesa já está ocupada.')
            return redirect('lista_mesas')
        
        # Ação para reservar uma mesa (a partir do estado livre)
        elif action == 'reservar_mesa':
            try:
                # O método reservar já faz as validações
                mesa.reservar(user=request.user) # Supondo que o usuário esteja autenticado
                messages.success(request, f'Mesa {mesa.numero} reservada por 30 minutos.')
            except ValueError as e:
                messages.error(request, str(e))
            return redirect('lista_mesas')

        # Ação para liberar uma mesa (a partir do estado ocupado ou reservado)
        elif action == 'liberar_mesa':
            if mesa.reservada:
                mesa.cancelar_reserva()
                messages.success(request, f'Mesa {mesa.numero} liberada.')
            elif mesa.ocupada:
                mesa.ocupada = False
                mesa.save()
                messages.success(request, f'Mesa {mesa.numero} liberada.')
            else:
                messages.error(request, 'Esta mesa já está livre.')
            return redirect('lista_mesas')

        # Esta ação agora é mais específica, para alternar o estado de uma mesa que já está ocupada
        elif action == 'toggle_mesa':
            mesa.ocupada = not mesa.ocupada
            mesa.save()
            messages.success(request, f'Estado da mesa {mesa.numero} alternado para {"ocupada" if mesa.ocupada else "livre"}.')
            return redirect('lista_mesas')

        messages.error(request, 'Ação inválida.')
        return redirect('lista_mesas')


class DetalheMesaView(View):
    def get(self, request, mesa_id):
        mesa = get_object_or_404(Mesa, pk=mesa_id)
        pedidos = mesa.pedidos.all()
        return render(request, 'SelfService/detalhe_mesa.html', {'mesa': mesa, 'pedidos': pedidos})