from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone

from ..models.Mesa import Mesa
from ..models.Pedido import Pedido
from ..serializers import MesaSerializer, RegisterSerializer
from ..serializers import PedidosSerializer
from ..serializers import ItemCardapioSerializer
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

# --- AUTH ---
class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# --- MESAS ---
class MesasLivresView(generics.ListAPIView):
    serializer_class = MesaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # livres = não ocupadas e não reservadas (ou reserva expirada)
        now = timezone.now()
        qs = Mesa.objects.all()
        # expirar automaticamente
        qs.filter(reservada=True, reserva_expira_em__lt=now).update(
            reservada=False, reservada_por=None, reserva_expira_em=None
        )
        return qs.filter(ocupada=False, reservada=False)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def reservar_mesa(request, mesa_id):
    try:
        mesa = Mesa.objects.select_for_update().get(pk=mesa_id)
    except Mesa.DoesNotExist:
        return Response({"detail": "Mesa não encontrada."}, status=404)

    try:
        mesa.reservar(request.user, minutos=30)
    except ValueError as e:
        return Response({"detail": str(e)}, status=400)

    return Response(MesaSerializer(mesa).data, status=200)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def cancelar_reserva(request, mesa_id):
    try:
        mesa = Mesa.objects.get(pk=mesa_id, reservada=True, reservada_por=request.user)
    except Mesa.DoesNotExist:
        return Response({"detail": "Reserva não encontrada."}, status=404)
    mesa.cancelar_reserva()
    return Response({"detail": "Reserva cancelada."}, status=200)

# --- PEDIDOS ---
class Pedidos(generics.ListAPIView):
    serializer_class = PedidosSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        mesa_id = self.request.query_params.get('mesa_id')
        if not mesa_id:
            return Pedido.objects.all()  # Retorna todos os pedidos se mesa_id não for fornecido
        return Pedido.objects.filter(mesa_id=mesa_id)


# --- CARDÁPIO API ---
class CardapioItemsView(generics.ListAPIView):
    serializer_class = ItemCardapioSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        from ..models.ItemCardapio import ItemCardapio
        return ItemCardapio.objects.all()
