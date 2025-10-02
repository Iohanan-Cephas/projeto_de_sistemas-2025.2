from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile, ProfileMobile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
@receiver(post_save, sender=User, dispatch_uid="create_profiles_for_user")
def create_profiles_for_user(sender, instance, created, **kwargs):
    if created:
        # cria só se não existir
        Profile.objects.get_or_create(
            user=instance,
            defaults={"role": "ATENDENTE"},
        )
        ProfileMobile.objects.get_or_create(
            user=instance,
            defaults={"is_mobile": True},
        )