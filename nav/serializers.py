from rest_framework import serializers
from .models import Waypoint, Port


class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = "__all__"

        def get(self):
            return Waypoint.objects.all()

        def post(self, data):
            return Waypoint.objects.create(data)


class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = "__all__"

        def get(self):
            return Port.objects.all()

        def post(self, data):
            return Port.objects.all()
