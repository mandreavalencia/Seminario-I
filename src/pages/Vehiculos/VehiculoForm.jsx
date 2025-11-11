import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function VehiculoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado que contiene todos los campos necesarios, con 'modelo' como STRING
    const [formData, setFormData] = useState({
        placa: '',
        marca: '',
        modelo: '2023', // Inicializado como STRING
        capacidad: 5.5, // Inicializado como número (float)
        tipo_combustible: 'Diésel',
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const PERFIL_ID = "985b1cf6-cbf1-49df-a5ae-9141d3ce9e28"; 

    // Lógica para cargar datos si estamos en modo Edición
    useEffect(() => {
        if (id) {
            setError(null);
            // La API de Vehículos está bajo /api/vehiculos, pero en el código anterior
            // se omitía '/api'. Asumo que tu 'api.js' ya incluye '/api'. 
            api.get(`/vehiculos/${id}`)
                .then((res) => {
                    const data = res.data;
                    setFormData({
                        placa: data.placa || '',
                        marca: data.marca || '',
                        modelo: String(data.modelo) || '2023', // Asegurar que es string
                        capacidad: data.capacidad || 5.5,
                        tipo_combustible: data.tipo_combustible || 'Diésel',
                    });
                })
                .catch(() => {
                    setError("No se pudo cargar la información del vehículo.");
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        let val = value;
        
        // Conversión a número (float) solo para 'capacidad'
        if (name === 'capacidad' && type === 'number') {
            val = parseFloat(value);
        } else if (name === 'modelo') {
            // Mantener como string forzado para cumplir validación del servidor
            val = String(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos mínimos obligatorios
        if (!formData.placa.trim() || !formData.marca.trim()) {
            setError("La Placa y la Marca son obligatorias.");
            return;
        }

        setSubmitting(true);
        setError(null);

        // Payload con todos los campos y el perfil_id
        const payload = {
            ...formData,
            perfil_id: PERFIL_ID,
            // Aseguramos que el modelo es un string en el payload final
            modelo: String(formData.modelo), 
        };

        try {
            if (id) {
                // Modo Edición (PUT)
                await api.put(`/api/vehiculos/${id}`, payload);
                alert("Vehículo actualizado exitosamente!");
                navigate(`/vehiculos`); // Navega a la lista
            } else {
                // Modo Creación (POST)
                await api.post('/api/vehiculos', payload);
                alert("Vehículo creado exitosamente!");
                navigate("/vehiculos"); // Navega a la lista
            }

        } catch (err) {
            console.error("Error al guardar el vehículo:", err.response?.data || err.message);
            const apiError = err.response?.data?.message || err.response?.data?.error || "Error al guardar el vehículo. Verifique los campos y el formato.";
            setError(apiError);
        } finally {
            setSubmitting(false);
        }
    };

    const title = id ? "Editar Vehículo" : "Crear Nuevo Vehículo";

    return (
        <div style={{ padding: "1rem" }}>
            <h2>{title}</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                
                {/* Placa */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="placa">Placa:</label>
                    <input type="text" id="placa" name="placa" value={formData.placa} onChange={handleChange} required style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px' }} />
                </div>
                
                {/* Marca */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="marca">Marca:</label>
                    <input type="text" id="marca" name="marca" value={formData.marca} onChange={handleChange} required style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px' }} />
                </div>

                {/* Modelo (Año) - Se mantiene como STRING */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="modelo">Modelo (Año):</label>
                    <input type="number" id="modelo" name="modelo" value={formData.modelo} onChange={handleChange} required style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px' }} />
                </div>

                {/* Capacidad (Número) */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="capacidad">Capacidad (en toneladas/litros):</label>
                    <input type="number" step="0.1" id="capacidad" name="capacidad" value={formData.capacidad} onChange={handleChange} required style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px' }} />
                </div>

                {/* Tipo de Combustible */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="tipo_combustible">Tipo de Combustible:</label>
                    <select id="tipo_combustible" name="tipo_combustible" value={formData.tipo_combustible} onChange={handleChange} style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px' }}>
                        <option value="Diésel">Diésel</option>
                        <option value="Gasolina">Gasolina</option>
                        <option value="Eléctrico">Eléctrico</option>
                    </select>
                </div>
                
                {submitting && <p>Guardando...</p>}

                <button type="submit" disabled={submitting} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none' }}>
                    {id ? 'Actualizar' : 'Guardar'} Vehículo
                </button>
                
                <button type="button" onClick={() => navigate('/vehiculos')} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: 'gray', color: 'white', border: 'none' }}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}