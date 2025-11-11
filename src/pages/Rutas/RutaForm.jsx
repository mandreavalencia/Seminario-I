import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function RutaForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre_ruta: '',
        color_hex: '#000000',
        calles: [], // Almacenará los IDs de las calles seleccionadas
        shape: '',
    });
    
    // 🛑 NUEVOS ESTADOS para manejar las calles disponibles
    const [callesDisponibles, setCallesDisponibles] = useState([]);
    const [cargandoCalles, setCargandoCalles] = useState(true);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const PERFIL_ID = "985b1cf6-cbf1-49df-a5ae-9141d3ce9e28";

    // 1. EFECTO para cargar los datos de la Ruta si estamos editando
    useEffect(() => {
        if (id) {
            setCargando(true);
            // La URL en la API de Rutas es /api/rutas/{id}
            api.get(`/api/rutas/${id}`)
                .then(res => {
                    const rutaData = res.data;
                    
                    setFormData({
                        nombre_ruta: rutaData.nombre_ruta || '',
                        color_hex: rutaData.color_hex || '#000000',
                        // Si la API devuelve un array de objetos calle, extrae solo los IDs
                        calles: rutaData.calles?.map(c => c.id) || [], 
                        shape: rutaData.shape || '',
                    });
                })
                .catch(err => {
                    setError("No se pudo cargar la ruta para editar. Verifique el ID.");
                })
                .finally(() => setCargando(false));
        }
    }, [id]);

    // 2. 🛑 NUEVO EFECTO para obtener la lista completa de calles
    useEffect(() => {
        api.get(`/api/calles?perfil_id=${PERFIL_ID}`)
            .then(res => {
                // Accedemos a la data anidada ya que la API usa paginación
                setCallesDisponibles(res.data.data || []); 
            })
            .catch(err => {
                console.error("Error al cargar las calles:", err);
                setError("Error al cargar las calles disponibles.");
            })
            .finally(() => setCargandoCalles(false));
    }, []); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🛑 NUEVO MANEJADOR para el campo de selección múltiple
    const handleCallesChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedIds = selectedOptions.map(option => option.value);

        setFormData(prev => ({
            ...prev,
            calles: selectedIds,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre_ruta.trim()) {
            setError("El nombre de la ruta es obligatorio.");
            return;
        }

        // ⚠️ Validación: Aseguramos que al menos se selecciona una calle
        if (formData.calles.length === 0) {
            setError("Debe seleccionar al menos una calle para crear la ruta.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const payload = {
            ...formData,
            perfil_id: PERFIL_ID,
            // Las calles ya vienen del estado y son el array de IDs
            // Ya no necesitamos un ID fijo.
            // calles: ["813c43d9-5306-4ece-a1a6-2514024d7559"], 
            shape: formData.shape || '',
        };

        try {
            if (id) {
                await api.put(`/api/rutas/${id}`, payload);
                alert("Ruta actualizada exitosamente!");
            } else {
                await api.post('/api/rutas', payload);
                alert("Ruta creada exitosamente!");
            }
            navigate('/rutas'); 

        } catch (err) {
            const apiError = err.response?.data?.message || err.response?.data?.error || "Error al guardar la ruta. Inténtalo de nuevo.";
            setError(apiError);
        } finally {
            setSubmitting(false);
        }
    };

    const title = id ? 'Editar Ruta' : 'Crear Nueva Ruta';

    if (cargando) return <p>Cargando datos de la ruta...</p>;
    if (cargandoCalles) return <p>Cargando calles disponibles...</p>; // Nuevo estado de carga

    return (
        <div style={{ padding: "1rem" }}>
            <h2>{title}</h2>

            <form onSubmit={handleSubmit}>
                {/* 1. Nombre de la Ruta */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="nombre_ruta">Nombre de la Ruta:</label>
                    <input
                        type="text"
                        id="nombre_ruta"
                        name="nombre_ruta"
                        value={formData.nombre_ruta}
                        onChange={handleChange}
                        required
                        style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                {/* 2. Color HEX */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="color_hex">Color HEX:</label>
                    <input
                        type="color" 
                        id="color_hex"
                        name="color_hex"
                        value={formData.color_hex}
                        onChange={handleChange}
                        style={{ display: 'block', marginTop: '5px' }}
                    />
                    <small>Valor: {formData.color_hex}</small>
                </div>
                
                {/* 3. 🛑 NUEVO CAMPO: Selección de Calles */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="calles">Seleccionar Calles (Mantén CTRL/CMD para selección múltiple):</label>
                    <select
                        id="calles"
                        name="calles"
                        multiple // Permite seleccionar varias opciones
                        value={formData.calles} // Valor es un array de IDs
                        onChange={handleCallesChange} // Usa el nuevo manejador
                        required
                        style={{ display: 'block', width: '300px', padding: '8px', marginTop: '5px', minHeight: '150px' }}
                    >
                        {callesDisponibles.map(calle => (
                            <option key={calle.id} value={calle.id}>
                                {calle.nombre} ({calle.id.substring(0, 8)}...)
                            </option>
                        ))}
                    </select>
                    {callesDisponibles.length === 0 && (
                        <p style={{ color: 'orange' }}>No hay calles disponibles. Crea una primero.</p>
                    )}
                </div>

                {/* Campo shape oculto, si aún lo requieres */}
                <input type="hidden" name="shape" value={formData.shape} />
                
                {submitting && <p>Guardando...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button 
                    type="submit" 
                    disabled={submitting || cargandoCalles}
                    style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none' }}
                >
                    {id ? 'Actualizar' : 'Guardar'} Ruta
                </button>
                
                <button 
                    type="button" 
                    onClick={() => navigate('/rutas')}
                    style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: 'gray', color: 'white', border: 'none' }}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}