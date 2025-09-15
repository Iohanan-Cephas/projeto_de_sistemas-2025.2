from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from ..models import Mesa
from ..serializers import SerializerMesa

class LoginAPI(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        role = getattr(getattr(user, 'profile', None), 'role', None)
        return Response({'token': token.key, 'user_id': user.pk, 'email': user.email, 'role': role})


class APIListarMesas(ListCreateAPIView):
    serializer_class = SerializerMesa

    def get_queryset(self):
        return Mesa.objects.all()
