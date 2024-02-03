from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PathAPIView, WaypointViewSet

urlpatterns = [
    path("path-api/", PathAPIView.as_view(), name="path-api")
]