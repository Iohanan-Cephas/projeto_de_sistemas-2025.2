from django.db import models

class ItemCardapio(models.Model):
    CATEGORIAS = (
        ('comida', 'Comida'),
        ('bebida', 'Bebida'),
    )
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    preco = models.DecimalField(max_digits=6, decimal_places=2)
    categoria = models.CharField(max_length=10, choices=CATEGORIAS, default='comida')
