// src/pages/Calles/CalleDetail.jsx

import { useParams } from 'react-router-dom';

export default function CalleDetail() {
    const { id } = useParams();
    
    return (
        <div style={{ padding: "1rem" }}>
            <h2>Detalle de Calle</h2>
            <p>ID de Calle: {id}</p>
            <p>Este es el componente de detalle de calle. (Pendiente de implementación).</p>
        </div>
    );
}