from django.db import models

class ItemPedido(models.Model):
    pedido = models.ForeignKey('Pedido', on_delete=models.CASCADE, related_name='itens_pedido')
    item = models.ForeignKey('ItemCardapio', on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.item.preco * self.quantidade

    def __str__(self):
        return f"{self.quantidade}x {self.item.nome}"
