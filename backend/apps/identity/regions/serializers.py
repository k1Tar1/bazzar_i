from rest_framework import serializers
from .models import Wilaya


class WilayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wilaya
        fields = ['id', 'code', 'name_fr', 'name_ar', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
