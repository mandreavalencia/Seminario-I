import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Route as RouteIcon, Trash2, Clock, Ruler, Loader2 } from "lucide-react";
import { routesService } from "@/services/routesService";
import { toast } from "@/hooks/use-toast";

mapboxgl.accessToken = API_CONFIG.MAPBOX_ACCESS_TOKEN;

interface RouteMapProps {
  onRouteCreated: (routeData: {
    coordinates: [number, number][];
    distance: number;
    duration: number;
  }) => void;
}

export function RouteMap({ onRouteCreated }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [points, setPoints] = useState<[number, number][]>([]);
  const [routeDrawn, setRouteDrawn] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-77.077789, 3.889851], // Default center (Colombia)
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
    }), "top-right");

    // Click handler for adding points
    map.current.on("click", (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      addPoint(coords);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const addPoint = useCallback((coords: [number, number]) => {
    if (routeDrawn) return;

    // Add marker
    const marker = new mapboxgl.Marker({
      color: "#22c55e",
      draggable: true,
    })
      .setLngLat(coords)
      .addTo(map.current!);

    const index = markersRef.current.length;

    marker.on("dragend", () => {
      const newLngLat = marker.getLngLat();
      setPoints(prev => {
        const newPoints = [...prev];
        newPoints[index] = [newLngLat.lng, newLngLat.lat];
        return newPoints;
      });
    });

    markersRef.current.push(marker);
    setPoints(prev => [...prev, coords]);
  }, [routeDrawn]);

  const clearPoints = useCallback(() => {
    // Remove markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Remove route layer if exists
    if (map.current?.getLayer("route")) {
      map.current.removeLayer("route");
    }
    if (map.current?.getSource("route")) {
      map.current.removeSource("route");
    }

    setPoints([]);
    setRouteDrawn(false);
    setRouteInfo(null);
    setRouteCoordinates([]);
  }, []);

  const drawRoute = async () => {
    if (points.length < 2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Necesitas al menos 2 puntos para dibujar una ruta",
      });
      return;
    }

    setIsDrawing(true);

    try {
      const response = await routesService.getDirections(points);
      
      if (response.routes && response.routes.length > 0) {
        const route = response.routes[0];
        const coordinates = route.geometry.coordinates as [number, number][];

        // Remove existing route if any
        if (map.current?.getLayer("route")) {
          map.current.removeLayer("route");
        }
        if (map.current?.getSource("route")) {
          map.current.removeSource("route");
        }

        // Add route to map
        map.current?.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        });

        map.current?.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#22c55e",
            "line-width": 5,
            "line-opacity": 0.8,
          },
        });

        // Fit bounds to route
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        map.current?.fitBounds(bounds, { padding: 50 });

        const distance = route.distance / 1000; // Convert to km
        const duration = route.duration / 60; // Convert to minutes

        setRouteInfo({ distance, duration });
        setRouteDrawn(true);
        setRouteCoordinates(coordinates);

        toast({
          title: "Ruta dibujada",
          description: `Distancia: ${distance.toFixed(2)} km | Tiempo: ${duration.toFixed(0)} min`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo obtener la ruta de Mapbox",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  const handleSaveRoute = () => {
    if (!routeInfo || routeCoordinates.length === 0) return;
    
    onRouteCreated({
      coordinates: routeCoordinates,
      distance: routeInfo.distance,
      duration: routeInfo.duration,
    });
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />

      {/* Map Controls */}
      <Card className="absolute left-4 top-4 z-10 p-4 glass">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{points.length} punto{points.length !== 1 ? "s" : ""}</span>
          </div>

          {routeInfo && (
            <div className="space-y-1 border-t pt-3">
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="h-4 w-4 text-accent" />
                <span>{routeInfo.distance.toFixed(2)} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-accent" />
                <span>{routeInfo.duration.toFixed(0)} min</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {!routeDrawn ? (
              <>
                <Button
                  size="sm"
                  onClick={drawRoute}
                  disabled={points.length < 2 || isDrawing}
                  className="gradient-primary"
                >
                  {isDrawing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Dibujando...
                    </>
                  ) : (
                    <>
                      <RouteIcon className="mr-2 h-4 w-4" />
                      Dibujar Ruta
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearPoints}
                  disabled={points.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleSaveRoute}
                  className="gradient-primary"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Registrar Ruta
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearPoints}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Nueva Ruta
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Instructions */}
      {!routeDrawn && points.length === 0 && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <Card className="px-4 py-2 glass">
            <p className="text-sm text-muted-foreground">
              Haz clic en el mapa para agregar puntos de la ruta
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
