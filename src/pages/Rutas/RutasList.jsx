// src/pages/Rutas/RutasList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api"; 

export default function RutasList() {
const [rutas, setRutas] = useState([]);
 const [error, setError] = useState(null);
 const [cargando, setCargando] = useState(true);

 const PERFIL_ID = "985b1cf6-cbf1-49df-a5ae-9141d3ce9e28";
 
 useEffect(() => {
 api
 .get(`/api/rutas?perfil_id=${PERFIL_ID}`) 
 .then((res) => {
 // Usa coalescencia nula (??) para asegurar un array [] como fallback
 setRutas(res.data.data ?? []);
 })
 .catch((err) => {
 console.error("Error al obtener las rutas:", err);
 setError("No se pudieron cargar las rutas 😔");
 })
 .finally(() => setCargando(false));
 }, []); 

 if (cargando) return <p>Cargando rutas...</p>;
 if (error) return <p style={{ color: "red" }}>{error}</p>;

 return (
 <div style={{ padding: "1rem" }}>
 <h2>Lista de Rutas</h2>
 
 <Link to="/rutas/nuevo" style={{ marginBottom: "10px", display: "block" }}>
 + Agregar Nueva Ruta
</Link>

 {/* Verifica la longitud (el '?' es redundante pero seguro) */}
 {rutas?.length === 0 ? (
 <p>No hay rutas registradas.</p>

) : (
 <ul>
 {/* Usa el encadenamiento opcional para que el .map solo se ejecute si 'rutas' existe */}
{rutas?.map((ruta) => ( 
 <li key={ruta.id}>
 <strong>{ruta.nombre || `Ruta #${ruta.id.substring(0, 8)}`}</strong> 
<Link to={`/rutas/${ruta.id}`} style={{ marginLeft: "10px" }}>Ver Detalle</Link>
 </li>
))}
 </ul>
 )}
 </div>
);
}