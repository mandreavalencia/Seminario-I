import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Truck, Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { vehiclesService } from "@/services/vehiclesService";
import { Vehicle } from "@/types";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const vehicleSchema = z.object({
  placa: z.string().min(1, "La placa es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  marca: z.string().min(1, "La marca es requerida"),
});

const initialForm = {
  placa: "",
  modelo: "",
  marca: "",
  activo: true,
};

export default function Vehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchVehicles = async () => {
    if (!user?.perfil_id) return;
    try {
      const data = await vehiclesService.getAll(user.perfil_id);
      setVehicles(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los vehículos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user?.perfil_id]);

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setForm({
        placa: vehicle.placa,
        modelo: vehicle.modelo,
        marca: vehicle.marca,
        activo: vehicle.activo,
      });
    } else {
      setEditingVehicle(null);
      setForm(initialForm);
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = vehicleSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user?.perfil_id) return;

    setIsSubmitting(true);
    try {
      if (editingVehicle?.id) {
        await vehiclesService.update(editingVehicle.id, {
          ...form,
          perfil_id: user.perfil_id,
        });
        toast({
          title: "Vehículo actualizado",
          description: "El vehículo ha sido actualizado correctamente.",
        });
      } else {
        await vehiclesService.create({
          ...form,
          perfil_id: user.perfil_id,
        });
        toast({
          title: "Vehículo creado",
          description: "El vehículo ha sido registrado correctamente.",
        });
      }
      setIsDialogOpen(false);
      fetchVehicles();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el vehículo",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteVehicle?.id) return;

    try {
      await vehiclesService.delete(deleteVehicle.id);
      toast({
        title: "Vehículo eliminado",
        description: "El vehículo ha sido eliminado correctamente.",
      });
      setDeleteVehicle(null);
      fetchVehicles();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el vehículo",
      });
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Vehículos</h1>
            <p className="mt-1 text-muted-foreground">
              Gestiona tu flota de vehículos de recolección
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? "Editar Vehículo" : "Nuevo Vehículo"}
                </DialogTitle>
                <DialogDescription>
                  {editingVehicle
                    ? "Modifica los datos del vehículo"
                    : "Completa los datos para registrar un nuevo vehículo"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    id="placa"
                    placeholder="ABC-123"
                    value={form.placa}
                    onChange={(e) => setForm({ ...form, placa: e.target.value })}
                  />
                  {errors.placa && <p className="text-xs text-destructive">{errors.placa}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      placeholder="Toyota"
                      value={form.marca}
                      onChange={(e) => setForm({ ...form, marca: e.target.value })}
                    />
                    {errors.marca && <p className="text-xs text-destructive">{errors.marca}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      placeholder="Hilux 2024"
                      value={form.modelo}
                      onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                    />
                    {errors.modelo && <p className="text-xs text-destructive">{errors.modelo}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="activo">Estado del vehículo</Label>
                    <p className="text-sm text-muted-foreground">
                      {form.activo ? "Activo y disponible" : "Inactivo o en mantenimiento"}
                    </p>
                  </div>
                  <Switch
                    id="activo"
                    checked={form.activo}
                    onCheckedChange={(checked) => setForm({ ...form, activo: checked })}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : editingVehicle ? (
                      "Actualizar"
                    ) : (
                      "Crear Vehículo"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, marca o modelo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-6 w-24 rounded bg-muted" />
                  <div className="h-4 w-32 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-10 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Truck className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="font-display text-xl font-semibold">No hay vehículos</h3>
              <p className="mt-2 text-center text-muted-foreground">
                {searchQuery
                  ? "No se encontraron vehículos con esa búsqueda"
                  : "Agrega tu primer vehículo para comenzar"}
              </p>
              {!searchQuery && (
                <Button className="mt-4 gradient-primary" onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Vehículo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle, index) => (
              <Card
                key={vehicle.id}
                className="animate-fade-in group transition-shadow hover:shadow-lg"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        {vehicle.placa}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {vehicle.marca} {vehicle.modelo}
                      </CardDescription>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        vehicle.activo
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {vehicle.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(vehicle)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setDeleteVehicle(vehicle)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteVehicle} onOpenChange={() => setDeleteVehicle(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El vehículo "{deleteVehicle?.placa}" será
                eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
