from nav.views import WaypointViewSet
from rest_framework import routers

routers = routers.DefaultRouter()
routers.register('nav', WaypointViewSet, basename="waypoint")