"// P�gina principal" 
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido al sistema de recolección ♻️</h1>
      <p className="home-subtitle">
        Administra fácilmente los vehículos, rutas y calles del sistema.  
        Usa el menú superior para navegar entre las secciones.
      </p>

      <div className="home-cards">

         <Link to="/vehiculos" className="home-card">
           <img 
            src="https://casainglesa.co/wp-content/uploads/2022/10/M2-e1667937159122.png" 
            alt="Vehículos" 
            className="home-icon"
          />
          <h3>Vehículos</h3>
          <p>Monitorea y gestiona la flota activa.</p>
        </Link>

        <Link to="/rutas" className="home-card">
          <img 
            src="https://cdn.prod.website-files.com/660434c1499c35fc0c04ed11/662fee7a1844c49d67061f1e_map.webp" 
            alt="Rutas" 
            className="home-icon"
          />
          <h3>Rutas</h3>
          <p>Consulta y asigna las rutas de recolección.</p>
        </Link>

        <Link to="/calles" className="home-card">
          <img 
            src="https://motollopis.es/wp-content/uploads/2021/04/mejores-rutas-en-moto-Valencia.png" 
            alt="Calles" 
            className="home-icon"
          />
          <h3>Calles</h3>
          <p>Visualiza las zonas cubiertas por el servicio.</p>
        </Link>
      </div>
    </div>
  );
}
