from rest_framework import serializers
from .models import Mesa
from django.contrib.auth.models import User


class SerializerMesa(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = '__all__'


class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = ["id", "numero", "capacidade", "ocupada",
                  "reservada", "reservada_por", "reserva_expira_em"]
        read_only_fields = ["ocupada", "reservada_por", "reserva_expira_em"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, data):
        user = User.objects.create_user(
            username=data["username"],
            email=data.get("email", ""),
            password=data["password"]
        )
        return user