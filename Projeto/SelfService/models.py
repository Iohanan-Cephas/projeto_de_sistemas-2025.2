from django.db import models

# Create your models here.
class Mesa(models.Model):
    numero = models.PositiveIntegerField(unique=True)
    capacidade = models.PositiveIntegerField(default=4)  # Quantas pessoas a mesa suporta
    ocupada = models.BooleanField(default=False)

    def __str__(self):
        return f"Mesa {self.numero}"
    
class ItemCardapio(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=7, decimal_places=2)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome
    
class Pedido(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pendente'),
        ('E', 'Em preparo'),
        ('C', 'Concluído'),
        ('F', 'Faturado'),
    ]

    mesa = models.ForeignKey(Mesa, on_delete=models.CASCADE, related_name='pedidos')
    itens = models.ManyToManyField(ItemCardapio, through='ItemPedido')
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pedido {self.id} - Mesa {self.mesa.numero}"

    def total(self):
        return sum(item.subtotal() for item in self.itens_pedido.all())
    
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens_pedido')
    item = models.ForeignKey(ItemCardapio, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.item.preco * self.quantidade

    def __str__(self):
        return f"{self.quantidade}x {self.item.nome}"