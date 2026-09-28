from pickle import TRUE
from enum import unique
import uuid
from apps.identity.accounts.validators import validate_phone
from django.db.models import F
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.contrib.auth.models import Group
from apps.identity.regions.models import Wilaya

class UserManager(DjangoUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        customer_group, _ = Group.objects.get_or_create(name="Customer")
        user.groups.add(customer_group)
        return user
    
    def create_seller(self, email, password = None, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        seller_group, _ = Group.objects.get_or_create(name="Seller")
        user.groups.add(seller_group)
        return user

    def create_admin(self, email, password = None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        user = self.create_user(email, password, **extra_fields)
        seller_group, _ = Group.objects.get_or_create(name="Seller")
        admin_group, _ = Group.objects.get_or_create(name="Admin")
        user.groups.add(seller_group)
        user.groups.add(admin_group)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        user = self.create_user(email, password, **extra_fields)
        seller_group, _ = Group.objects.get_or_create(name="Seller")
        admin_group, _ = Group.objects.get_or_create(name="Admin")
        user.groups.add(seller_group)
        user.groups.add(admin_group)
        return user


class User(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    username = None
    email = models.EmailField(
        unique=True,
        blank=False
    )
    first_name = models.CharField(
        max_length=30,
        blank=False
    )
    last_name = models.CharField(
        max_length=30,
        blank=False
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    
    objects = UserManager()

    wilaya = models.ForeignKey(
        Wilaya, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    phone = models.CharField(max_length=12, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_email_verified = models.BooleanField(default=False)
    def __str__(self):
        return self.email

    @property
    def is_admin(self):
        return self.is_staff or self.is_superuser or self.groups.filter(name="Admin").exists()

    @property
    def is_seller(self):
        return hasattr(self, "seller_profile") or self.groups.filter(name="Seller").exists()