import networkx as nx
from shapely.geometry import Point, LineString
from nav.models import Waypoint


def wayfinder(source, target, coordinates, allowed_edges):
    G = nx.Graph()

    for point, coords in coordinates.items():
        G.add_node(point, pos=coords)

    for u in G.nodes():
        for v in G.nodes():
            if u != v:
                distance = Point(coordinates[u]).distance(Point(coordinates[v]))
                G.add_edge(u, v, weight=distance)

    G_allowed = G.edge_subgraph(allowed_edges)
    shortest_path = nx.shortest_path(G_allowed, source=source, target=target, weight="weight")

    coord_dict = {}

    for i in shortest_path:
        waypoint = Waypoint.objects.get(wp_id=i)
        coord_dict[waypoint.wp_id] = [waypoint.latitude, waypoint.longitude]

    return coord_dict


def find_closest_waypoint(latitude, longitude, coordinates):
    user_coords = (latitude, longitude)

    # Calculate distances from the user's coordinates to all waypoints
    distances = {wp_id: Point(coords).distance(Point(user_coords)) for wp_id, coords in coordinates.items()}

    # Find the waypoint with the minimum distance
    closest_waypoint = min(distances, key=distances.get)

    return closest_waypoint