// src/pages/Calles/CalleForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function CalleForm() {
    const navigate = useNavigate();
    
    // El campo 'shape' es complejo, lo inicializamos como un JSON string vacío
    const [formData, setFormData] = useState({
        nombre: '',
        shape: '{"type":"LineString","coordinates":[]}', // Shape mínimo válido como JSON string
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    // Definimos el ID de perfil
    const PERFIL_ID = "985b1cf6-cbf1-49df-a5ae-9141d3ce9e28"; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campo obligatorio
        if (!formData.nombre.trim()) {
            setError("El nombre de la calle es obligatorio.");
            return;
        }

        setSubmitting(true);
        setError(null);

        // Payload final con el perfil_id
        const payload = {
            nombre: formData.nombre,
            perfil_id: PERFIL_ID,
            shape: formData.shape,
        };

        try {
            await api.post('/api/calles', payload);
            alert("Calle creada exitosamente!");
            // Navega a la lista de calles después de guardar
            navigate('/calles'); 

        } catch (err) {
            console.error("Error al guardar la calle:", err.response?.data || err.message);
            // Captura y muestra un mensaje de error más específico de la API (si existe)
            const apiError = err.response?.data?.message || err.response?.data?.error || "Error al guardar la calle. Inténtalo de nuevo.";
            setError(apiError);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Crear Nueva Calle</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="nombre">Nombre de la Calle:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                
                {/* Campo Shape oculto con valor por defecto para cumplir la API */}
                <input type="hidden" name="shape" value={formData.shape} />


                {submitting && <p>Guardando...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button 
                    type="submit" 
                    disabled={submitting}
                    style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none' }}
                >
                    Guardar Calle
                </button>
                
                <button 
                    type="button" 
                    onClick={() => navigate('/calles')}
                    style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: 'gray', color: 'white', border: 'none' }}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
// 🛑 LÍNEA ELIMINADA: La exportación default ya se hace en la línea de la función.