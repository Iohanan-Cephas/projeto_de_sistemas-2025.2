from django import forms
from django.contrib.auth.models import User
from .models import Profile

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]
        widgets = {
            "first_name": forms.TextInput(attrs={"class": "w-full mt-1 px-3 py-2 border rounded-lg"}),
            "last_name": forms.TextInput(attrs={"class": "w-full mt-1 px-3 py-2 border rounded-lg"}),
            "email": forms.EmailInput(attrs={"class": "w-full mt-1 px-3 py-2 border rounded-lg"}),
        }

class ProfileReadonlyForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ["role"]
        widgets = {
            "role": forms.Select(attrs={"class": "w-full mt-1 px-3 py-2 border rounded-lg", "disabled": True})
        }
