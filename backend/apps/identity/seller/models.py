from django.db import models
from django.conf import settings
from apps.identity.accounts.models import User
from apps.identity.regions.models import Wilaya

# class Seller(models.Model):
#     user = models.OneToOneField(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name="seller",
#         null=True,
#         blank=True,
#     )

#     shop_name = models.CharField(max_length=100, blank=False, null=False)
#     phone = models.CharField(max_length=20, blank=False, null=False, unique=True)
#     location = models.CharField(max_length=100, blank=False, null=False)
#     city = models.CharField(max_length=100, blank=False, null=False)
#     country = models.CharField(max_length=100, blank=False, null=False)
#     vat_id = models.CharField(max_length=15, null=False, blank=False)

#     # Shop Verification Fields
#     VERIFICATION_CHOICES = [
#         ('unverified', 'Unverified'),
#         ('pending', 'Pending'),
#         ('verified', 'Verified'),
#         ('rejected', 'Rejected'),
#     ]
#     shop_verification_status = models.CharField(
#         max_length=20,
#         choices=VERIFICATION_CHOICES,
#         default='unverified',
#     )

#     # Proof Fields (Image Uploads)
#     vat_document = models.ImageField(
#         upload_to='shop_verification_docs/', 
#         null=True, 
#         blank=True
#     )
#     # Add other proof fields as needed, e.g., trade_license, etc.

#     # Verification Details
#     rejected_reason = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = 'Seller'
#         verbose_name_plural = 'Sellers'

#     def __str__(self):
#         return self.shop_name

#     @property
#     def is_verified(self):
#         """Check if the seller's shop is verified"""
#         return self.shop_verification_status == 'verified'

#     def is_pending(self):
#         """Check if the seller's shop verification is pending"""
#         return self.shop_verification_status == 'pending'

#     def is_rejected(self):
#         """Check if the seller's shop verification is rejected"""
#         return self.shop_verification_status == 'rejected'

#     def is_unverified(self):
#         """Check if the seller's shop verification is unverified"""
#         return self.shop_verification_status == 'unverified'

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
    business_wilaya = models.ForeignKey(
        Wilaya, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=False
    )
    business_address = models.CharField(max_length=255, null=True, blank=False)
    business_phone = models.CharField(max_length=12, null=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user.email



class SellerIdVerificationDemand(models.Model):
    class VerificationDemandStatus(models.TextChoices):
        pending = "pending", "Pending"
        rejected = "rejected", "Rejected"
    seller = models.OneToOneField(SellerProfile, on_delete=models.CASCADE)
    token = models.CharField(
        max_length=64,
        unique=True,
    )    
    id_image = models.ImageField(upload_to='id_verification_images/', blank=True, null=True)
    selfie_image = models.ImageField(upload_to='selfie_verification_images/', blank=True, null=True)
    nin = models.CharField(max_length=18, null=False, blank=False)
    status = models.CharField(
        max_length=20,
        choices=VerificationDemandStatus.choices,
        default=VerificationDemandStatus.pending,
    )
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.seller.user.email

class VerifiedSellerId(models.Model):
    class VerificationType(models.TextChoices):
        in_office = 'in_office', 'In Office'
        online = 'online', 'Online'
    seller = models.OneToOneField(SellerProfile, on_delete=models.CASCADE)
    id_image = models.ImageField(upload_to='id_verification_images/', blank=False, null=False)
    selfie_image = models.ImageField(upload_to='selfie_verification_images/', blank=True, null=True)
    nin = models.CharField(max_length=18, null=False, blank=False)
    accepted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_id_verifications')
    verification_type = models.CharField(max_length=20, choices=VerificationType.choices, default=VerificationType.online)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.seller.user.email

class SellerRegistrationVerificationDemand(models.Model):
    class VerificationDemandStatus(models.TextChoices):
        pending = "pending", "Pending"
        rejected = "rejected", "Rejected"
    seller = models.OneToOneField(SellerProfile, on_delete=models.CASCADE)
    token = models.CharField(
        max_length=64,
        unique=True,
    )    
    business_registration_image = models.ImageField(upload_to='registration_verification_images/', blank=False, null=False)
    nif = models.CharField(max_length=15, null=False, blank=False)
    status = models.CharField(
        max_length=20,
        choices=VerificationDemandStatus.choices,
        default=VerificationDemandStatus.pending,
    )
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.seller.user.email

class VerifiedSellerRegistry(models.Model):
    class VerificationType(models.TextChoices):
        in_office = 'in_office', 'In Office'
        online = 'online', 'Online'
    seller = models.OneToOneField(SellerProfile, on_delete=models.CASCADE)
    business_registration_image = models.ImageField(upload_to='business_registration_images/', blank=False, null=False)
    nif = models.CharField(max_length=15, null=False, blank=False)
    accepted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_registry_verifications')
    verification_type = models.CharField(max_length=20, choices=VerificationType.choices, default=VerificationType.online)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.seller.user.email