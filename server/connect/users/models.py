from django.db import models
from django.contrib.auth.models import AbstractUser


# ---------------------------
# Custom User Model
# ---------------------------
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('service_provider', 'Service Provider'),
        ('client', 'Client'),
        ('agent', 'Agent'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.email}) - {self.role}"


# ---------------------------
# Service Provider Profile
# ---------------------------
class ServiceProvider(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='service_profile'
    )
    phone_number = models.CharField(max_length=15)
    company_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.username} ({self.user.email}) - Service Provider"


# ---------------------------
# System Manager Profile (Admins/Agents)
# ---------------------------
class SystemManager(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='system_profile'
    )
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.user.username} ({self.user.email}) - System Manager"
