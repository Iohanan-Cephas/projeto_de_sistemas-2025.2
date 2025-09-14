from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_mesas, name='lista_mesas'),
    path('mesa/<int:mesa_id>/', views.detalhe_mesa, name='detalhe_mesa'),
    path('pedido/adicionar/<int:mesa_id>/', views.adicionar_pedido, name='adicionar_pedido'),
]
