# SelfService/models/Profile.py
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = [
        ('ATENDENTE', 'Atendente'),
        ('GERENTE', 'Gerente'),
        ('CLIENTE', 'Cliente'),
    ]
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',          # acesso reverso: user.profile
        related_query_name='profile',
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ATENDENTE')

    def __str__(self):
        return f'{self.user.username} ({self.get_role_display()})'


class ProfileMobile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='mobile_profile',   # <<< NOME REVERSO DIFERENTE
        related_query_name='mobile_profile',
    )
    is_mobile = models.BooleanField(default=True)

    def __str__(self):
        return f'PerfilMobile {self.user.username}'

    class Meta:
        verbose_name = 'Perfil Mobile'
        verbose_name_plural = 'Perfis Mobile'
