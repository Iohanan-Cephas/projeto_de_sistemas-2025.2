from django.db import models

class Pedido(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pendente'),
        ('E', 'Em preparo'),
        ('C', 'Concluído'),
        ('F', 'Faturado'),
    ]

    mesa = models.ForeignKey('Mesa', on_delete=models.CASCADE, related_name='pedidos')
    itens = models.ManyToManyField('ItemCardapio', through='ItemPedido')
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='E')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pedido {self.id} - Mesa {self.mesa.numero}"

    def total(self):
        return sum(item.subtotal() for item in self.itens_pedido.all())
