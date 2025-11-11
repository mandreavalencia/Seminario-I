// Detalles del vehiculo
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./VehiculoDetail.css";

export default function VehiculoDetail() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/vehiculos/${id}`)
      .then((res) => setVehiculo(res.data))
      .catch(() => setError("No se pudo cargar la información del vehículo."));
  }, [id]);

  const handleEliminar = async () => {
    if (window.confirm("¿Seguro que deseas eliminar este vehículo?")) {
      try {
        await api.delete(`/api/vehiculos/${id}`);
        alert("Vehículo eliminado con éxito 🚗");
        navigate("/vehiculos");
      } catch {
        alert("Error al eliminar el vehículo.");
      }
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!vehiculo) return <p>Cargando información...</p>;

  return (
    <div className="vehiculo-detail-container">
      <div className="vehiculo-detail-image">
        <img
          src={
            vehiculo.imagen_url ||
            "https://cdn-icons-png.flaticon.com/512/741/741407.png"
          }
          alt="Vehículo"
        />
      </div>

      <div className="vehiculo-detail-info">
        <h2>Vehículo {vehiculo.placa}</h2>

        <p><strong>Marca:</strong> {vehiculo.marca}</p>
        <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
        <p><strong>Color:</strong> {vehiculo.color || "No especificado"}</p>
        <p><strong>Año:</strong> {vehiculo.anio || "No registrado"}</p>

        <div className="vehiculo-detail-buttons">
          <Link to={`/vehiculos/${vehiculo.id}/editar`} className="btn-editar">
            Editar
          </Link>
          <button onClick={handleEliminar} className="btn-eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
