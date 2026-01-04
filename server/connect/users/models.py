from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('service_provider', 'Service Provider'),
        ('client', 'Client'),
        ('agent', 'Agent'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"


class ServiceProvider(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='service_profile'
    )
    phone_number = models.CharField(max_length=15)
    company_name = models.CharField(
        max_length=255,
        blank=True,   # ✅ allows empty in forms
        null=True     # ✅ allows NULL in database
    )

    def __str__(self):
        return f"{self.user.username} - Service Provider"
