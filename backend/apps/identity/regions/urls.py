
from django.urls import path
from .views import WilayaListView, WilayaDetailView

urlpatterns = [
    path('', WilayaListView.as_view(), name='wilaya-list'),
    path('<int:pk>/', WilayaDetailView.as_view(), name='wilaya-detail'),
]
