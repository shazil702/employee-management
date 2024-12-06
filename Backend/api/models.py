from django.contrib.auth.models import AbstractUser
from django.db import models

# Model for Custom Authentication
class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    phone = models.CharField(max_length=20,null=True,blank=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
# Model for Creating Emplyees dynamically
class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    data = models.JSONField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Employee {self.id}"
