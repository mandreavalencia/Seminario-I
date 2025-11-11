import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";

// Importaciones de Vehículos
import VehiculosList from "./pages/Vehiculos/VehiculosList";
import VehiculoForm from "./pages/Vehiculos/VehiculoForm";
import VehiculoDetail from "./pages/Vehiculos/VehiculoDetail";

// Importaciones de Rutas
import RutasList from "./pages/Rutas/RutasList";
import RutaForm from "./pages/Rutas/RutaForm";
import RutaDetail from "./pages/Rutas/RutaDetail";

// Importaciones de calles
import CallesList from "./pages/Calles/CallesList"; 
import CalleForm from "./pages/Calles/CalleForm";  
import CalleDetail from "./pages/Calles/CalleDetail"; 

import NotFound from "./pages/NotFound";
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ----------------- Rutas protegidas de Vehículos ----------------- */}
        <Route
          path="/vehiculos"
          element={<PrivateRoute><VehiculosList /></PrivateRoute>}
        />
        <Route
          path="/vehiculos/nuevo"
          element={<PrivateRoute><VehiculoForm /></PrivateRoute>}
        />
        <Route
          path="/vehiculos/:id"
          element={<PrivateRoute><VehiculoDetail /></PrivateRoute>}
        />
        <Route
          path="/vehiculos/:id/editar"
          element={<PrivateRoute><VehiculoForm /></PrivateRoute>}
        />

        {/* ------------------- Rutas protegidas de Rutas ------------------- */}
        <Route
          path="/rutas"
          element={<PrivateRoute><RutasList /></PrivateRoute>}
        />
        <Route
          path="/rutas/nuevo"
          element={<PrivateRoute><RutaForm /></PrivateRoute>}
        />
        <Route
          path="/rutas/:id"
          element={<PrivateRoute><RutaDetail /></PrivateRoute>}
        />
        <Route
          path="/rutas/:id/editar"
          element={<PrivateRoute><RutaForm /></PrivateRoute>}
        />
        
        {/* 🛑 2. RUTAS PROTEGIDAS DE CALLES (AÑADIDAS) */}
        <Route
          path="/calles"
          element={<PrivateRoute><CallesList /></PrivateRoute>}
        />
        <Route
          path="/calles/nuevo"
          element={<PrivateRoute><CalleForm /></PrivateRoute>}
        />
        <Route
          path="/calles/:id"
          element={<PrivateRoute><CalleDetail /></PrivateRoute>}
        />
        <Route
          path="/calles/:id/editar"
          element={<PrivateRoute><CalleForm /></PrivateRoute>}
        />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}