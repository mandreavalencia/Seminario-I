import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List, Loader2, Clock, Ruler, Eye } from "lucide-react";
import { RouteMap } from "@/components/map/RouteMap";
import { RouteViewDialog } from "@/components/map/RouteViewDialog";
import { routesService } from "@/services/routesService";
import { Route } from "@/types";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const routeNameSchema = z.object({
  nombre_ruta: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export default function Routes() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [nameError, setNameError] = useState("");
  const [pendingRouteData, setPendingRouteData] = useState<{
    coordinates: [number, number][];
    distance: number;
    duration: number;
  } | null>(null);
  const [viewingRoute, setViewingRoute] = useState<Route | null>(null);

  const getPointsCount = (shape: Route["shape"]) => {
    try {
      const parsed = typeof shape === "string" ? JSON.parse(shape) : shape;
      if (parsed.type === "MultiLineString") {
        return (parsed.coordinates as [number, number][][]).reduce(
          (sum, coords) => sum + coords.length,
          0
        );
      }
      return (parsed.coordinates as [number, number][]).length;
    } catch {
      return 0;
    }
  };

  const fetchRoutes = async () => {
    if (!user?.perfil_id) return;
    try {
      const data = await routesService.getAll(user.perfil_id);
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [user?.perfil_id]);

  const handleRouteCreated = (routeData: {
    coordinates: [number, number][];
    distance: number;
    duration: number;
  }) => {
    setPendingRouteData(routeData);
    setIsDialogOpen(true);
    setRouteName("");
    setNameError("");
  };

  const handleSaveRoute = async () => {
    const result = routeNameSchema.safeParse({ nombre_ruta: routeName });
    if (!result.success) {
      setNameError(result.error.errors[0].message);
      return;
    }

    if (!user?.perfil_id || !pendingRouteData) return;

    setIsSubmitting(true);
    try {
      await routesService.create({
        nombre_ruta: routeName,
        perfil_id: user.perfil_id,
        shape: {
          coordinates: pendingRouteData.coordinates,
          type: "LineString",
        },
        distancia: pendingRouteData.distance,
        tiempo: pendingRouteData.duration,
      });

      toast({
        title: "Ruta guardada",
        description: `La ruta "${routeName}" ha sido creada correctamente.`,
      });

      setIsDialogOpen(false);
      setPendingRouteData(null);
      fetchRoutes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la ruta",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-7rem)] flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">Rutas</h1>
          <p className="mt-1 text-muted-foreground">
            Crea y gestiona las rutas de recolección
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="map" className="flex-1">
          <TabsList className="mb-4">
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="h-4 w-4" />
              Crear Ruta
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Mis Rutas ({routes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="h-[calc(100%-3rem)] mt-0">
            <Card className="h-full overflow-hidden">
              <RouteMap onRouteCreated={handleRouteCreated} />
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="h-6 w-32 rounded bg-muted" />
                      <div className="h-4 w-24 rounded bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : routes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MapPin className="mb-4 h-16 w-16 text-muted-foreground/50" />
                  <h3 className="font-display text-xl font-semibold">No hay rutas</h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    Ve a la pestaña "Crear Ruta" para crear tu primera ruta
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {routes.map((route, index) => (
                  <Card
                    key={route.id}
                    className="animate-fade-in transition-shadow hover:shadow-lg"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <div className="rounded-lg bg-accent/10 p-2">
                              <MapPin className="h-4 w-4 text-accent" />
                            </div>
                            {route.nombre_ruta}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {getPointsCount(route.shape)} puntos en la ruta
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {route.distancia && (
                            <div className="flex items-center gap-1">
                              <Ruler className="h-4 w-4" />
                              <span>{route.distancia.toFixed(2)} km</span>
                            </div>
                          )}
                          {route.tiempo && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{route.tiempo.toFixed(0)} min</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingRoute(route)}
                          className="w-full"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Ruta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Save Route Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Guardar Ruta</DialogTitle>
              <DialogDescription>
                Ingresa un nombre para identificar esta ruta
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="route-name">Nombre de la ruta</Label>
                <Input
                  id="route-name"
                  placeholder="Ej: Ruta Centro - Norte"
                  value={routeName}
                  onChange={(e) => {
                    setRouteName(e.target.value);
                    setNameError("");
                  }}
                />
                {nameError && <p className="text-xs text-destructive">{nameError}</p>}
              </div>

              {pendingRouteData && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="mb-2 text-sm font-medium">Información de la ruta:</p>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-accent" />
                      <span>{pendingRouteData.distance.toFixed(2)} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span>{pendingRouteData.duration.toFixed(0)} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>{pendingRouteData.coordinates.length} puntos</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveRoute}
                className="gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Ruta"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Route Dialog */}
        <RouteViewDialog
          route={viewingRoute}
          open={!!viewingRoute}
          onOpenChange={(open) => !open && setViewingRoute(null)}
        />
      </div>
    </AppLayout>
  );
}
