import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { API_CONFIG } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Route, RouteShape } from "@/types";
import { Clock, Ruler, MapPin, Loader2 } from "lucide-react";

mapboxgl.accessToken = API_CONFIG.MAPBOX_ACCESS_TOKEN;

interface RouteViewDialogProps {
  route: Route | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function parseShape(shape: RouteShape | string): RouteShape | null {
  if (typeof shape === "string") {
    try {
      return JSON.parse(shape);
    } catch {
      return null;
    }
  }
  return shape;
}

function getCoordinatesArray(shape: RouteShape): [number, number][][] {
  if (shape.type === "MultiLineString") {
    return shape.coordinates as [number, number][][];
  }
  return [shape.coordinates as [number, number][]];
}

export function RouteViewDialog({ route, open, onOpenChange }: RouteViewDialogProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    if (!open || !route) return;

    // Clean up previous map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    setIsMapLoading(true);

    // Small delay to ensure the dialog is fully rendered
    const timeout = setTimeout(() => {
      if (!mapContainer.current) return;

      const parsedShape = parseShape(route.shape);
      if (!parsedShape) return;

      const coordinatesArrays = getCoordinatesArray(parsedShape);
      
      // Calculate center and bounds
      const bounds = new mapboxgl.LngLatBounds();
      coordinatesArrays.forEach(coords => {
        coords.forEach(coord => bounds.extend(coord));
      });

      const center = bounds.getCenter();

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [center.lng, center.lat],
        zoom: 14,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        if (!map.current) return;

        setIsMapLoading(false);

        // Add source and layer for each line
        coordinatesArrays.forEach((coords, index) => {
          const sourceId = `route-${index}`;
          const layerId = `route-layer-${index}`;

          map.current!.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
            },
          });

          map.current!.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": route.color_hex || "#22c55e",
              "line-width": 5,
              "line-opacity": 0.8,
            },
          });
        });

        // Add start and end markers for each segment
        coordinatesArrays.forEach((coords, index) => {
          if (coords.length > 0) {
            // Start marker
            new mapboxgl.Marker({ color: "#22c55e" })
              .setLngLat(coords[0])
              .setPopup(new mapboxgl.Popup().setHTML(`<p>Inicio ${index + 1}</p>`))
              .addTo(map.current!);

            // End marker
            if (coords.length > 1) {
              new mapboxgl.Marker({ color: "#ef4444" })
                .setLngLat(coords[coords.length - 1])
                .setPopup(new mapboxgl.Popup().setHTML(`<p>Fin ${index + 1}</p>`))
                .addTo(map.current!);
            }
          }
        });

        // Fit bounds
        map.current.fitBounds(bounds, { padding: 50 });
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [open, route]);

  if (!route) return null;

  const parsedShape = parseShape(route.shape);
  const totalPoints = parsedShape
    ? getCoordinatesArray(parsedShape).reduce((sum, coords) => sum + coords.length, 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {route.nombre_ruta}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full gap-4">
          {/* Route info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {route.distancia && (
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-accent" />
                <span>{route.distancia.toFixed(2)} km</span>
              </div>
            )}
            {route.tiempo && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span>{route.tiempo.toFixed(0)} min</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <span>{totalPoints} puntos</span>
            </div>
          </div>

          {/* Map */}
          <div className="relative flex-1 min-h-[400px] rounded-lg overflow-hidden border">
            {isMapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <div
              ref={mapContainer}
              className="absolute inset-0"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
