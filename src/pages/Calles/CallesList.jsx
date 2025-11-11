import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

export default function CallesList() {
    const [calles, setCalles] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Asumimos que necesitas un perfil_id para listar las calles
    const PERFIL_ID = "985b1cf6-cbf1-49df-a5ae-9141d3ce9e28"; 

    useEffect(() => {
        const fetchCalles = async () => {
            try {
                // Usamos el endpoint que nos da la documentación de Swagger
                const res = await api.get(`/api/calles?perfil_id=${PERFIL_ID}`);
                
                // Asegúrate de acceder al array correcto: res.data.data
                const dataArray = res.data.data || [];
                setCalles(dataArray);

            } catch (err) {
                console.error("Error al cargar la lista de calles:", err);
                setError("Error al cargar las calles. Verifique la conexión.");
            } finally {
                setCargando(false);
            }
        };
        fetchCalles();
    }, []);

    if (cargando) return <p>Cargando lista de calles...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Lista de Calles</h2>
            <Link 
                to="/calles/nuevo" 
                style={{ marginBottom: "10px", display: "block" }}
            >
                + Agregar Nueva Calle
            </Link>

            {calles?.length === 0 ? (
                <p>No hay calles registradas.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calles.map(calle => (
                            <tr key={calle.id}>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{calle.nombre}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px', fontSize: 'small' }}>{calle.id}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                    <Link to={`/calles/${calle.id}/editar`}>Editar</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
