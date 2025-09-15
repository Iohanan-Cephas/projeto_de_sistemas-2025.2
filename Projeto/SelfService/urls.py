from django.urls import path
from .views import (
    ListaMesasView, DetalheMesaView, AdicionarPedidoView,
    LoginView, LogoutView, DashboardView, DashboardAttendantView, DashboardManagerView,
    LoginAPI, APIListarMesas
)

urlpatterns = [

    path('', DashboardView.as_view(), name='dashboard'),
    path('mesas/', ListaMesasView.as_view(), name='lista_mesas'),
    path('mesas/<int:mesa_id>/', DetalheMesaView.as_view(), name='detalhe_mesa'),
    path('mesas/<int:mesa_id>/adicionar/', AdicionarPedidoView.as_view(), name='adicionar_pedido'),

    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('dashboard/atendente/', DashboardAttendantView.as_view(), name='dashboardAtendente'),
    path('dashboard/gerente/', DashboardManagerView.as_view(), name='dashboardGerente'),

    path('api-auth/', LoginAPI.as_view(), name='api_login'),
    path('api/mesas/', APIListarMesas.as_view(), name='api_mesas'),
]
