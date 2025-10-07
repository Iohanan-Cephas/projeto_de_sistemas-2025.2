from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile, ProfileMobile, ItemPedido


@receiver([post_save, post_delete], sender=ItemPedido)
def atualizar_valor_pedido(sender, instance, **kwargs):
    """
    Atualiza o campo 'valor' do Pedido com base na soma dos subtotais de seus itens.
    """
    pedido = instance.pedido
    
  
    if pedido:
        
        novo_valor = sum(item.subtotal() for item in pedido.itens_pedido.all())
     
        pedido.valor = novo_valor
        pedido.save(update_fields=["valor"])


@receiver(post_save, sender=User)
def create_profiles_for_user(sender, instance, created, **kwargs):
    """
    Cria automaticamente um Profile e um ProfileMobile para um novo usuário, 
    somente no momento da sua criação no banco de dados.
    """
   
    if created:
      
        Profile.objects.get_or_create(user=instance)
        ProfileMobile.objects.get_or_create(user=instance)