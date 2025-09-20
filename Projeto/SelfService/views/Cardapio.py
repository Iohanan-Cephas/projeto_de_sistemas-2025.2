
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.shortcuts import redirect
from ..models import ItemCardapio

class RoleRequiredMixin:
    role_required = 'GERENTE'
    def dispatch(self, request, *args, **kwargs):
        role = request.session.get('role', 'ATENDENTE')
        if role != self.role_required:
            return redirect('dashboard')
        return super().dispatch(request, *args, **kwargs)

class CardapioListView(LoginRequiredMixin, RoleRequiredMixin, ListView):
    model = ItemCardapio
    template_name = 'SelfService/cardapio_list.html'
    context_object_name = 'itens'

class CardapioCreateView(LoginRequiredMixin, RoleRequiredMixin, CreateView):
    model = ItemCardapio
    fields = ['nome', 'preco', 'descricao']
    template_name = 'SelfService/cardapio_form.html'
    success_url = reverse_lazy('cardapio_list')

class CardapioUpdateView(LoginRequiredMixin, RoleRequiredMixin, UpdateView):
    model = ItemCardapio
    fields = ['nome', 'preco', 'descricao']
    template_name = 'SelfService/cardapio_form.html'
    success_url = reverse_lazy('cardapio_list')

class CardapioDeleteView(LoginRequiredMixin, RoleRequiredMixin, DeleteView):
    model = ItemCardapio
    template_name = 'SelfService/cardapio_confirm_delete.html'
    success_url = reverse_lazy('cardapio_list')
