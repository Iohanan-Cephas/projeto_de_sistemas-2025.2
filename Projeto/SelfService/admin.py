from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, Mesa, ItemCardapio, Pedido, ItemPedido

# Inline apenas para EDITAR o Profile (o sinal cria automaticamente)
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfil'
    extra = 0  # não oferece form vazio para "criar outro"

class CustomUserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'get_role')
    list_select_related = ('profile',)  # evita N+1 na listagem

    # Não mostrar o inline na página de "Add user"
    def get_inline_instances(self, request, obj=None):
        if obj is None:
            return []  # sem inlines no add_view; o sinal cria o Profile no save
        return super().get_inline_instances(request, obj)

    @admin.display(description='Função', ordering='profile__role')
    def get_role(self, obj):
        # evita exceção se por algum motivo o profile ainda não existir
        return getattr(getattr(obj, 'profile', None), 'role', '—')

# Substitui o UserAdmin padrão
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
