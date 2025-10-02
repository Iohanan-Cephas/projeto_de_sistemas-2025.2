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
from .views.Historico import HistoricoPedidosView  

from SelfService.views.ApiViews import RegisterView, MesasLivresView, reservar_mesa, cancelar_reserva
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('mesas/', ListaMesasView.as_view(), name='lista_mesas'),
    path('mesas/<int:mesa_id>/', DetalheMesaView.as_view(), name='detalhe_mesa'),
    path('mesas/<int:mesa_id>/adicionar/', AdicionarPedidoView.as_view(), name='adicionar_pedido'),

    # Histórico
    path("historico/", HistoricoPedidosView.as_view(), name="historico_pedidos"),
    
    # Dashboards
    path('dashboard/atendente/', DashboardAttendantView.as_view(), name='dashboardAtendente'),
    path('dashboard/gerente/', DashboardManagerView.as_view(), name='dashboardGerente'),

    # APIs
    #path('api-auth/', LoginAPI.as_view(), name='api_login'),
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
    path("historico/", HistoricoPedidosView.as_view(), name="historico_pedidos"),
    # Meu perfil
    path('perfil/', MeuPerfilView.as_view(), name='meu_perfil'),


    #API MOBILE 

    path("api/auth/register/", RegisterView.as_view(), name="api_register"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="api_login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="api_refresh"),

    path("api/mesas/livres/", MesasLivresView.as_view(), name="api_mesas_livres"),
    path("api/mesas/<int:mesa_id>/reservar/", reservar_mesa, name="api_reservar_mesa"),
    path("api/mesas/<int:mesa_id>/cancelar/", cancelar_reserva, name="api_cancelar_reserva"),
]
