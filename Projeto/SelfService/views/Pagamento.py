from django.views.decorators.http import require_POST
from django.shortcuts import render, get_object_or_404, redirect
from ..models import Pedido, Mesa, ItemPedido 
from decimal import Decimal
from django.contrib import messages

def fechar_conta(request, mesa_id):
    mesa = get_object_or_404(Mesa, id=mesa_id)
    pedidos = Pedido.objects.filter(mesa=mesa, status__in=['P', 'E', 'C']) # Apenas pedidos relevantes para a conta

    # --- NOVA LINHA: Buscando todos os itens detalhados ---
    # Aqui, buscamos todos os "ItemPedido" que pertencem aos pedidos da mesa atual.
    itens_da_conta = ItemPedido.objects.filter(pedido__in=pedidos).order_by('pedido__criado_em')

    total = sum(p.total() for p in pedidos)
    taxa_servico = total * Decimal('0.10')
    total_com_taxa = total + taxa_servico

    context = {
        "mesa": mesa,
        "pedidos": pedidos, # Mantemos para outros cálculos se necessário
        "itens_da_conta": itens_da_conta, # <- Enviando a nova lista para o template
        "total": total,
        "taxa_servico": taxa_servico,
        "total_com_taxa": total_com_taxa,
    }
    return render(request, "SelfService/fechar_conta.html", context)

@require_POST # Garante que esta view só pode ser acessada com um método POST (mais seguro)
def finalizar_conta(request, mesa_id):
    # 1. Encontra a mesa ou retorna erro 404
    mesa = get_object_or_404(Mesa, id=mesa_id)
    
    # 2. Encontra todos os pedidos da mesa que não estão faturados
    pedidos_para_fechar = Pedido.objects.filter(mesa=mesa).exclude(status='F')
    
    # 3. Atualiza o status de todos esses pedidos para 'F' (Faturado)
    #    O método .update() é mais eficiente do que um loop
    pedidos_para_fechar.update(status='F')
    
    # 4. Atualiza o status da mesa para 'L' (Livre)
    #    (Verifique se 'L' é o valor correto para "Livre" no seu modelo Mesa)
    mesa.status = 'L'
    mesa.save()
    
    # 5. Adiciona uma mensagem de sucesso para o usuário
    messages.success(request, f"A conta da Mesa {mesa.numero} foi finalizada com sucesso!")
    
    # 6. Redireciona o usuário para a lista de mesas
    return redirect('lista_mesas')