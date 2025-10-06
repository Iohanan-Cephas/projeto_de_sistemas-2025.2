from django.db import models

class ItemCardapio(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=7, decimal_places=2)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome
