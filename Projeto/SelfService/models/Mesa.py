from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Mesa(models.Model):
    numero = models.PositiveIntegerField(unique=True)
    capacidade = models.PositiveIntegerField(default=4)
    ocupada = models.BooleanField(default=False)

    # NOVO: reserva
    reservada = models.BooleanField(default=False)
    reservada_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # usuário que reservou (mobile)
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="mesas_reservadas"
    )
    reserva_expira_em = models.DateTimeField(null=True, blank=True)

    def reservar(self, user, minutos=30):
        # regra simples: só reserva se estiver livre e sem reserva/ocupação
        if self.ocupada or self.reservada:
            raise ValueError("Mesa já ocupada ou reservada.")
        self.reservada = True
        self.reservada_por = user
        self.reserva_expira_em = timezone.now() + timedelta(minutes=minutos)
        self.save(update_fields=["reservada", "reservada_por", "reserva_expira_em"])

    def cancelar_reserva(self):
        self.reservada = False
        self.reservada_por = None
        self.reserva_expira_em = None
        self.save(update_fields=["reservada", "reservada_por", "reserva_expira_em"])

    def __str__(self):
        return f"Mesa {self.numero}"
