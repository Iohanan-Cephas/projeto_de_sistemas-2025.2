from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

class MeuPerfilView(LoginRequiredMixin, TemplateView):
    template_name = "SelfService/meu_perfil.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        u = self.request.user
        p = getattr(u, "profile", None)
        ctx["user_info"] = {
            "username": u.username,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            "role": getattr(p, "role", "ATENDENTE"),
            "date_joined": u.date_joined,
            "last_login": u.last_login,
        }
        return ctx
