export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  perfil_id: string;
}

export interface AuthState {
  user: User | null;
  token?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}


export interface LoginCredentials {
  correo: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
  perfil_id: string;
}

export interface Vehicle {
  id?: string;
  placa: string;
  modelo: string;
  marca: string;
  activo: boolean;
  perfil_id: string;
}

export interface RouteShape {
  coordinates: [number, number][] | [number, number][][];
  type: "LineString" | "MultiLineString";
}

export interface Route {
  id?: string;
  nombre_ruta: string;
  perfil_id: string;
  shape: RouteShape | string;
  distancia?: number;
  tiempo?: number;
  color_hex?: string | null;
  recorridos_count?: number;
}

export interface MapboxDirectionsResponse {
  routes: {
    geometry: {
      coordinates: [number, number][];
      type: string;
    };
    distance: number;
    duration: number;
  }[];
}
