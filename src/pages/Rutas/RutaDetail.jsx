// src/pages/Rutas/RutaDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api"; // Tu instancia de Axios configurada

export default function RutaDetail() {
  // 1. Obtener el ID de la ruta de la URL
  const { id } = useParams();
  
  const [ruta, setRuta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCargando(true);
    setError(null);
    
    // Petición para obtener una ruta específica por ID
    api.get(`/api/rutas/${id}`)
      .then((res) => {
          // Asumo que el endpoint de detalle no está paginado, 
          // y la ruta está directamente en res.data
        setRuta(res.data); 
      })
      .catch((err) => {
        console.error("Error al obtener el detalle de la ruta:", err);
        setError("No se pudo cargar el detalle de la ruta.");
      })
      .finally(() => setCargando(false));
  }, [id]); // El efecto se ejecuta cuando cambia el ID

  // Función de ejemplo para manejar la eliminación de la ruta
  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de que deseas eliminar la ruta "${ruta.nombre_ruta}"?`)) {
      try {
        await api.delete(`/api/rutas/${id}`);
        navigate("/rutas"); // Redirigir a la lista después de eliminar
      } catch (err) {
        console.error("Error al eliminar la ruta:", err);
        alert("Error al eliminar la ruta.");
      }
    }
  };

  // Manejo de estados de carga y error
  if (cargando) return <p>Cargando detalle de la ruta...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!ruta) return <p>La ruta solicitada no fue encontrada.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Detalle: {ruta.nombre_ruta}</h2>

      <div>
        <p><strong>ID de Ruta:</strong> {ruta.id}</p>
        <p><strong>Perfil ID:</strong> {ruta.perfil_id}</p>
        <p><strong>Color (Hex):</strong> 
            <span style={{ 
                color: ruta.color_hex, 
                fontWeight: 'bold' 
            }}>{ruta.color_hex}</span>
        </p>
        <p><strong>Shape (Datos Geográficos):</strong> {ruta.shape}</p>
        <p><strong>Creado el:</strong> {new Date(ruta.created_at).toLocaleDateString()}</p>
      </div>

      {/* Botones de acción */}
      <div style={{ marginTop: '20px' }}>
        <Link to={`/rutas/${id}/editar`} style={{ marginRight: '10px' }}>
          <button>Editar Ruta</button>
        </Link>
        <button onClick={handleDelete} style={{ color: 'white', backgroundColor: 'red' }}>
          Eliminar Ruta
        </button>
      </div>
    </div>
  );
}
