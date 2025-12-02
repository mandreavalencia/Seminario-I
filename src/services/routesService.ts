import { Route, MapboxDirectionsResponse } from "@/types";
import { ROUTES_ENDPOINTS, getMapboxDirectionsUrl } from "@/config/api";

export const routesService = {
  async getAll(perfilId: string): Promise<Route[]> {
    const response = await fetch(ROUTES_ENDPOINTS.getAll(perfilId));
    if (!response.ok) {
      throw new Error("Error al obtener las rutas");
    }
    const data = await response.json();
    return data.data;
  },

  async create(route: Omit<Route, "id">): Promise<Route> {
    const response = await fetch(ROUTES_ENDPOINTS.create(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(route),
    });
    if (!response.ok) {
      throw new Error("Error al crear la ruta");
    }
    return response.json();
  },

  async getDirections(coordinates: [number, number][]): Promise<MapboxDirectionsResponse> {
    const url = getMapboxDirectionsUrl(coordinates);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener las direcciones");
    }
    return response.json();
  },
};
