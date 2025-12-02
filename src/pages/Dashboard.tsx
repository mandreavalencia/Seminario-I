import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, ArrowRight, Activity, Leaf } from "lucide-react";
import { vehiclesService } from "@/services/vehiclesService";
import { routesService } from "@/services/routesService";
import { Vehicle, Route } from "@/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.perfil_id) return;
      
      try {
        const [vehiclesData, routesData] = await Promise.all([
          vehiclesService.getAll(user.perfil_id).catch(() => []),
          routesService.getAll(user.perfil_id).catch(() => []),
        ]);
        setVehicles(vehiclesData);
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.perfil_id]);

  const activeVehicles = vehicles?.filter((v) => v?.activo)?.length;

  const stats = [
    {
      title: "Total Vehículos",
      value: vehicles?.length,
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Vehículos Activos",
      value: activeVehicles,
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Rutas Creadas",
      value: routes.length,
      icon: MapPin,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">
              ¡Hola, {user?.nombre}!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Bienvenido al panel de control de TurinClean
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/vehicles">
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Gestionar Vehículos
              </Button>
            </Link>
            <Link to="/routes">
              <Button className="gradient-primary">
                <MapPin className="mr-2 h-4 w-4" />
                Crear Ruta
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-display">
                    {loading ? "..." : stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Vehículos Recientes
              </CardTitle>
              <CardDescription>
                Últimos vehículos registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Truck className="mb-3 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No hay vehículos registrados</p>
                  <Link to="/vehicles">
                    <Button variant="link" className="mt-2">
                      Agregar primer vehículo
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div>
                        <p className="font-medium">{vehicle.placa}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.marca} {vehicle.modelo}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          vehicle.activo
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {vehicle.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  ))}
                  <Link to="/vehicles">
                    <Button variant="ghost" className="w-full mt-2">
                      Ver todos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Rutas Recientes
              </CardTitle>
              <CardDescription>
                Últimas rutas creadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : routes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="mb-3 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No hay rutas creadas</p>
                  <Link to="/routes">
                    <Button variant="link" className="mt-2">
                      Crear primera ruta
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {routes.slice(0, 3).map((route) => {
                    const getPointsCount = () => {
                      try {
                        const parsed = typeof route.shape === "string" ? JSON.parse(route.shape) : route.shape;
                        if (parsed.type === "MultiLineString") {
                          return (parsed.coordinates as [number, number][][]).reduce(
                            (sum: number, coords: [number, number][]) => sum + coords.length,
                            0
                          );
                        }
                        return (parsed.coordinates as [number, number][]).length;
                      } catch {
                        return 0;
                      }
                    };
                    return (
                      <div
                        key={route.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                        <div>
                          <p className="font-medium">{route.nombre_ruta}</p>
                          <p className="text-sm text-muted-foreground">
                            {getPointsCount()} puntos
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-accent">
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                    );
                  })}
                  <Link to="/routes">
                    <Button variant="ghost" className="w-full mt-2">
                      Ver todas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="gradient-hero text-primary-foreground animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CardContent className="flex flex-col items-center gap-4 py-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary-foreground/20 p-3">
                <Leaf className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Optimiza tus rutas de recolección</h3>
                <p className="text-primary-foreground/80">
                  Crea rutas eficientes y gestiona tu flota de vehículos
                </p>
              </div>
            </div>
            <Link to="/routes">
              <Button variant="secondary" size="lg">
                Comenzar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
