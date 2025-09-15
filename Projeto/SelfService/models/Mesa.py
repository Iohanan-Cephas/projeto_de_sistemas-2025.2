from django.db import models

class Mesa(models.Model):
    numero = models.PositiveIntegerField(unique=True)
    capacidade = models.PositiveIntegerField(default=4)  # Quantas pessoas a mesa suporta
    ocupada = models.BooleanField(default=False)

    def __str__(self):
        return f"Mesa {self.numero}"
