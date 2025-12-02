// Configuración de URLs de API
// Cambia estas URLs según tu backend

export const API_CONFIG = {
  // URL base para autenticación (configura tu backend aquí)
  AUTH_BASE_URL: "http://localhost:8000/api/auth",
  
  // URL para login
  LOGIN_URL: "http://localhost:8000/api/auth/login",
  
  // URL para registro
  REGISTER_URL: "http://localhost:8000/api/auth/register",
  
  // URL base para la API de recolección
  RECOLECCION_BASE_URL: "https://apirecoleccion.gonzaloandreslucio.com/api",
  
  // Mapbox
  MAPBOX_ACCESS_TOKEN: "pk.eyJ1IjoiZ2FzYW5jaGV6IiwiYSI6ImNtZzFtbjhzZzBwZ3AycnEyczF4dnpsOTkifQ.iMlhHXslPc5LTQeOKpL-rg",
};

// Endpoints de vehículos
export const VEHICLES_ENDPOINTS = {
  getAll: (perfilId: string) => `${API_CONFIG.RECOLECCION_BASE_URL}/vehiculos?perfil_id=${perfilId}`,
  create: () => `${API_CONFIG.RECOLECCION_BASE_URL}/vehiculos`,
  update: (id: string) => `${API_CONFIG.RECOLECCION_BASE_URL}/vehiculos/${id}`,
  delete: (id: string) => `${API_CONFIG.RECOLECCION_BASE_URL}/vehiculos/${id}`,
};

// Endpoints de rutas
export const ROUTES_ENDPOINTS = {
  getAll: (perfilId: string) => `${API_CONFIG.RECOLECCION_BASE_URL}/rutas?perfil_id=${perfilId}`,
  create: () => `${API_CONFIG.RECOLECCION_BASE_URL}/rutas`,
};

// Endpoint de Mapbox Directions
export const getMapboxDirectionsUrl = (coordinates: [number, number][]) => {
  const coordsString = coordinates.map(coord => coord.join(",")).join(";");
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&steps=false&access_token=${API_CONFIG.MAPBOX_ACCESS_TOKEN}`;
};
