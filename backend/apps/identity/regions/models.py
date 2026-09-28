from django.db import models

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
