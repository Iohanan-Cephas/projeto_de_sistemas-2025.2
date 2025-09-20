from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from ..models import Mesa

class PainelAtendenteView(View):
    def get(self, request):
        # Retorna todas as mesas para o template
        mesas = Mesa.objects.all().order_by("numero")
        return render(request, "SelfService/painel_atendente.html", {"mesas": mesas})


class StatusMesasJsonView(View):
    def get(self, request):
        # Rota para o JavaScript buscar o status em JSON
        mesas = Mesa.objects.all().values("id", "numero", "status")
        return JsonResponse(list(mesas), safe=False)
