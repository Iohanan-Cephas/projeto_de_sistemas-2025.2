from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from ..models import Profile
from ..forms import UserForm, ProfileForm
from django.db import transaction


class GerenteRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.profile.role == 'GERENTE'


class AtendenteCreateView(LoginRequiredMixin, GerenteRequiredMixin, CreateView):
    model = User
    form_class = UserForm
    template_name = 'login/AtendenteForm.html'
    success_url = reverse_lazy('lista_atendentes')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if 'profile_form' not in context:
            context['profile_form'] = ProfileForm(self.request.POST or None)
        context['titulo'] = 'Novo Atendente'
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        profile_form = context['profile_form']

        if profile_form.is_valid():
            with transaction.atomic():
                user = form.save()
                profile = user.profile
                profile.matricula = profile_form.cleaned_data['matricula']
                profile.role = 'ATENDENTE'
                profile.save()
            return redirect(self.success_url)
        else:
            return self.form_invalid(form)


class AtendenteUpdateView(LoginRequiredMixin, GerenteRequiredMixin, UpdateView):
    model = Profile
    fields = ['matricula']
    template_name = 'login/AtendenteForm.html'
    success_url = reverse_lazy('lista_atendentes')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if 'user_form' not in context:
            context['user_form'] = UserForm(
                self.request.POST or None, instance=self.object.user)
            context['user_form'].fields.pop('password', None)
        context['titulo'] = 'Editar Atendente'
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        user_form = context['user_form']

        if user_form.is_valid():
            with transaction.atomic():
                user_form.save()
                form.save()
            return redirect(self.success_url)
        else:
            return self.form_invalid(form)


class AtendenteDeleteView(LoginRequiredMixin, GerenteRequiredMixin, DeleteView):
    model = Profile
    template_name = 'login/AtendenteConfirmDelete.html'
    success_url = reverse_lazy('lista_atendentes')
    context_object_name = 'atendente'
