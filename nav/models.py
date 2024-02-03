from django.db import models


# Create your models here.

class Port(models.Model):
    port_id = models.CharField(max_length=3090)
    active = models.BooleanField(default=True)
    semantics = models.CharField(max_length=3090, default="")


class Waypoint(models.Model):
    name = models.CharField(max_length=3090, blank=True)
    wp_id = models.CharField(max_length=3090)
    latitude = models.FloatField()
    longitude = models.FloatField()
    ports = models.ManyToManyField(Port, related_name="ports", blank=True, default=None)

    def __str__(self):
        return self.name

    def get_other_waypoints(self):
        other_waypoints = Waypoint.objects.filter(ports__in=self.ports.all()).exclude(pk=self.pk)
        return list(other_waypoints.values_list('wp_id', flat=True))
