import { Vehicle } from "@/types";
import { VEHICLES_ENDPOINTS } from "@/config/api";

export const vehiclesService = {
  async getAll(perfilId: string): Promise<Vehicle[]> {
    const response = await fetch(VEHICLES_ENDPOINTS.getAll(perfilId));
    if (!response.ok) {
      throw new Error("Error al obtener los vehículos");
    }
    const data = await response.json();
    return data.data;
  },

  async create(vehicle: Omit<Vehicle, "id">): Promise<Vehicle> {
    const response = await fetch(VEHICLES_ENDPOINTS.create(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) {
      throw new Error("Error al crear el vehículo");
    }
    return response.json();
  },

  async update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const response = await fetch(VEHICLES_ENDPOINTS.update(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el vehículo");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(VEHICLES_ENDPOINTS.delete(id), {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el vehículo");
    }
  },
};
