import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "./VehiculosList.css";

export default function VehiculosList() {
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const PERFIL_ID = "985b1cf6-cbf1-49df-a5ae-9141d3ce9e28";

  useEffect(() => {
    api
      .get(`/api/vehiculos?perfil_id=${PERFIL_ID}`)
      .then((res) => setVehiculos(res.data.data))
      .catch(() => setError("No se pudieron cargar los vehículos."))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando vehículos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="vehiculos-container">
      <h2>Lista de Vehículos</h2>

      <Link to="/vehiculos/nuevo" className="add-btn">
        + Agregar Nuevo Vehículo
      </Link>

      {vehiculos?.length === 0 ? (
        <p>No hay vehículos registrados.</p>
      ) : (
        <div className="vehiculos-grid">
          {vehiculos.map((vehiculo) => (
            <div className="vehiculo-card" key={vehiculo.id}>
              <div className="vehiculo-imagen">
                <img
                  src={
                    vehiculo.imagen ||
                    "https://casainglesa.co/wp-content/uploads/2022/10/Global-Packer-e1667937371135.png"
                  }
                  alt={`Vehículo ${vehiculo.placa}`}
                />
              </div>
              <div className="vehiculo-info">
                <h3>{vehiculo.placa}</h3>
                <p><strong>Marca:</strong> {vehiculo.marca}</p>
                <p><strong>Modelo:</strong> {vehiculo.modelo}</p>

                <div className="vehiculo-acciones">
                  <Link to={`/vehiculos/${vehiculo.id}`} className="btn-detalle">
                    Ver Detalle
                  </Link>
                  <Link to={`/vehiculos/${vehiculo.id}/editar`} className="btn-editar">
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
