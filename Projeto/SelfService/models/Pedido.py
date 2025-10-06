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
    valor = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Pedido {self.id} - Mesa {self.mesa.numero}"

    def total(self):
        return sum(item.subtotal() for item in self.itens_pedido.all())

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Salva para garantir que o pedido tenha um ID
        # Atualiza o valor somando os subtotais dos itens
        total = sum(item.subtotal() for item in self.itens_pedido.all())
        if self.valor != total:
            self.valor = total
            super().save(update_fields=["valor"])  # Atualiza só o campo valor
