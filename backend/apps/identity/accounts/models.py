from enum import unique
import uuid
from apps.identity.accounts.validators import validate_phone
from django.db.models import F
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.contrib.auth.models import Group

class WilayaManager(models.Manager):
    def add_wilaya(self, code, name_fr, name_ar):
        if Wilaya.objects.filter(code=code).exists():
            Wilaya.objects.filter(code__gte=code).update(code=models.F("code") + 1)
        Wilaya.objects.create(code=code, name_fr=name_fr, name_ar=name_ar)
    def remove_wilaya(self, code):
        if Wilaya.objects.filter(code__gte=code).exists():
            Wilaya.objects.filter(code=code).delete()
            Wilaya.objects.filter(code__gte=code).update(code=models.F("code") - 1)
        else:
            raise ValueError("Wilaya does not exist")

class Wilaya(models.Model):
    id = models.BigAutoField(
        primary_key=True,
        auto_created=True
    )
    code = models.PositiveIntegerField(unique=True)
    name_fr = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = WilayaManager()

    def __str__(self):
        return f"{self.code} - {self.name_fr}"

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


class SellerProfile(models.Model):
    class VerificationStatus(models.TextChoices):
        unverified = 'unverified', 'Unverified'
        verified = 'verified', 'Verified'
        pending = 'pending', 'Pending'
        rejected = 'rejected', 'Rejected'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_profile"
    )
    nin = models.CharField(max_length=18, null=True, blank=False)
    nif = models.CharField(max_length=15, null=True, blank=True)
    business_wilaya = models.ForeignKey(
        Wilaya, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    business_address = models.CharField(max_length=255, null=True, blank=True)
    verification_status = models.CharField(max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.unverified)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user.email
    
class VerificationDemand(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique = True)
    token = models.CharField(max_length=64)
    id_image = models.ImageField(upload_to='verification_images/', blank=True, null=True)
    selfie_image = models.ImageField(upload_to='verification_images/', blank=True, null=True)
    nin = models.CharField(max_length=18, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user.email

class VerifiedId(models.Model):
    class VerificationType(models.TextChoices):
        in_office = 'in_office', 'In Office'
        online = 'online', 'Online'
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique = True)
    image = models.ImageField(upload_to='id_verification_images/', blank=True, null=True)
    nin = models.CharField(max_length=18, null=True, blank=True)
    accepted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_verifications')
    verification_type = models.CharField(max_length=20, choices=VerificationType.choices, default=VerificationType.online)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user.email
