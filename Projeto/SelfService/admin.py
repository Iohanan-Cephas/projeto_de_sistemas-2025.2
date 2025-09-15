from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, Mesa, ItemCardapio, Pedido, ItemPedido

# Inline para editar Profile dentro de User
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfil'

class CustomUserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'get_role')  # mostra role

    def get_role(self, obj):
        return obj.profile.role
    get_role.short_description = 'Função'
    get_role.admin_order_field = 'profile__role'

# Remove User padrão e registra com o custom
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Modelos do SelfService
@admin.register(Mesa)
class MesaAdmin(admin.ModelAdmin):
    list_display = ('numero', 'capacidade', 'ocupada')

@admin.register(ItemCardapio)
class ItemCardapioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'preco')

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 1

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'mesa', 'status', 'criado_em', 'atualizado_em')
    inlines = [ItemPedidoInline]
