from django.urls import path
from .views import (
    ListaMesasView, DetalheMesaView, AdicionarPedidoView,
    LoginView, LogoutView, DashboardView, DashboardAttendantView, DashboardManagerView,
    LoginAPI, APIListarMesas,
)
from .views.Pedidos import PedidosPorMesaView
from .views.Cardapio import (
    CardapioListView, CardapioCreateView, CardapioUpdateView, CardapioDeleteView
)
from django.contrib.auth.views import PasswordChangeView, PasswordChangeDoneView
from .views.Profile import MeuPerfilView
from .views.Historico import HistoricoView 


urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('mesas/', ListaMesasView.as_view(), name='lista_mesas'),
    path('mesas/<int:mesa_id>/', DetalheMesaView.as_view(), name='detalhe_mesa'),
    path('mesas/<int:mesa_id>/adicionar/', AdicionarPedidoView.as_view(), name='adicionar_pedido'),

    # Histórico
    path('historico/', HistoricoView.as_view(), name='historico'),
    
    # Dashboards
    path('dashboard/atendente/', DashboardAttendantView.as_view(), name='dashboardAtendente'),
    path('dashboard/gerente/', DashboardManagerView.as_view(), name='dashboardGerente'),

    # APIs
    path('api-auth/', LoginAPI.as_view(), name='api_login'),
    path('api/mesas/', APIListarMesas.as_view(), name='api_mesas'),

    # Pedidos por mesa
    path('pedidos/por-mesa/', PedidosPorMesaView.as_view(), name='pedidos_por_mesa'),

    # Cardápio (CRUD)
    path('cardapio/', CardapioListView.as_view(), name='cardapio_list'),
    path('cardapio/novo/', CardapioCreateView.as_view(), name='cardapio_create'),
    path('cardapio/<int:pk>/editar/', CardapioUpdateView.as_view(), name='cardapio_update'),
    path('cardapio/<int:pk>/excluir/', CardapioDeleteView.as_view(), name='cardapio_delete'),

    # Autenticação
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # Meu perfil
    path('perfil/', MeuPerfilView.as_view(), name='meu_perfil'),
]
