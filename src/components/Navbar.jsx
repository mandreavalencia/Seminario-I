// Barra de navegación
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">Sistema de recoleccion </Link>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? "✖" : "☰"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {!user ? (
            <>
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/login" className="btn" onClick={() => setOpen(false)}>Login</Link>
            </>
          ) : (
            <>
              <Link to="/inicio" onClick={() => setOpen(false)}>Inicio</Link>
              <Link to="/vehiculos" onClick={() => setOpen(false)}>Vehículos</Link>
              <Link to="/rutas" onClick={() => setOpen(false)}>Rutas</Link>
              <Link to="/calles" onClick={() => setOpen(false)}>Calles</Link>
              <button className="btn" onClick={() => { handleLogout(); setOpen(false); }}>
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
