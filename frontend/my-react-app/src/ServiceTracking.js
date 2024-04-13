import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceTracking = () => {
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllServiceTypes');
                setServiceTypes(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching service types:', err);
                setError(err.response ? err.response.data : err.message);
                setLoading(false);
            }
        };

        fetchServiceTypes();
    }, []);

    if (loading) return <p>Loading service types...</p>;
    if (error) return <p>Error fetching service types: {error}</p>;

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Service Tracking</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Cost</th>
                        <th>Duration (Hours)</th>
                    </tr>
                </thead>
                <tbody>
                    {serviceTypes.map((service, index) => (
                        <tr key={index}>
                            <td>{service.id}</td>
                            <td>{service.name}</td>
                            <td>${service.cost}</td>
                            <td>{service.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ServiceTracking;
