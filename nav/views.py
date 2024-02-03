from django.http import HttpResponse, JsonResponsefrom django.shortcuts import renderfrom rest_framework.viewsets import ModelViewSetfrom .serializers import WaypointSerializer, PortSerializerfrom .models import Waypointfrom rest_framework.views import APIViewfrom nav.utils import wayfinder, find_closest_waypointfrom nav.models import Waypoint, Port# Create your views here.class WaypointViewSet(ModelViewSet):    serializer_class = WaypointSerializer    queryset = Waypoint.objects.all()    def create(self, request, *args, **kwargs):        serializer = self.get_serializer(data=request.data)        serializer.is_valid(raise_exception=True)        self.perform_create(serializer)        headers = self.get_success_headers(serializer.data)        return JsonResponse(serializer.data, status=201, headers=headers)class PortViewSet(ModelViewSet):    serializer_class = PortSerializer    queryset = Port.objects.all()    def create(self, request, *args, **kwargs):        serializer = self.get_serializer(data=request.data)        serializer.is_valid(raise_exception=True)        self.perform_create(serializer)        headers = self.get_success_headers(serializer.data)        return JsonResponse(serializer.data, status=201, headers=headers)class PathAPIView(APIView):    @staticmethod    def post(request):        coordinates = {}        for i in Waypoint.objects.all():            coordinates[i.wp_id] = (i.latitude, i.longitude)        print(coordinates)        allowed_edges = [            ('wp1', 'wp3'),            ('wp2', 'wp3'),            ('wp3', 'wp4'),            ('wp4', 'wp5'),            ('wp5', 'wp6'),            ('wp4', 'wp7'),            ('wp5', 'wp8'),            ('wp8', 'wp9'),            ('wp9', 'wp10'),            ('wp9', 'wp11'),            ('wp1', 'wp2'),        ]        #for i in Waypoint.objects.all():        #    if i.ports.exists():        #        for j in i.get_other_waypoints():        #            append_tuple = (i.wp_id, j)        #            allowed_edges.append(append_tuple)        unique_set = set(frozenset(pair) for pair in allowed_edges)        allowed_edges = [tuple(pair) for pair in unique_set]        print(allowed_edges)        type = request.data.get("type")        if type == "coordinates":            latitude = request.data.get("latitude")            longitude = request.data.get("longitude")            target_name = request.data.get("target")            closest_waypoint = find_closest_waypoint(float(latitude), float(longitude), coordinates)            target_waypoint = Waypoint.objects.get(name=target_name)            target = target_waypoint.wp_id            output = wayfinder(closest_waypoint, target, coordinates, allowed_edges)            output = dict(output)            output_arr = []            print("array: ", output)            for i in output:                node = {"wp_id": i, "latitude": output[i][0], "longitude": output[i][1]}                output_arr.append(node)            # print(output_arr)            return JsonResponse(output_arr, safe=False)        elif type == "landmark":            source_name = request.data.get("source")            target_name = request.data.get("target")            source_waypoint = Waypoint.objects.get(name=source_name)            target_waypoint = Waypoint.objects.get(name=target_name)            source = source_waypoint.wp_id            target = target_waypoint.wp_id            output = wayfinder(source, target, coordinates, allowed_edges)            output = dict(output)            output_arr = []            print("array: ", output)            for i in output:                node = {"wp_id": i, "latitude": output[i][0], "longitude": output[i][1]}                output_arr.append(node)            # print(output_arr)            return JsonResponse(output_arr, safe=False)