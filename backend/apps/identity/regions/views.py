from rest_framework import generics
from .models import Wilaya
from .serializers import WilayaSerializer


class WilayaListView(generics.ListAPIView):
    queryset = Wilaya.objects.all()
    serializer_class = WilayaSerializer


class WilayaDetailView(generics.RetrieveAPIView):
    queryset = Wilaya.objects.all()
    serializer_class = WilayaSerializer
