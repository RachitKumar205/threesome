from nav.views import WaypointViewSet, PortViewSet
from rest_framework import routers

routers = routers.DefaultRouter()
routers.register('nav', WaypointViewSet, basename="waypoint")
routers.register('port', PortViewSet, basename="port")