import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Mechanics = () => {
    const [mechanics, setMechanics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMechanics = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getMechanics');
                setMechanics(response.data);
            } catch (error) {
                console.error('Error fetching mechanics:', error);
            }
        };

        fetchMechanics();
    }, []);

    return (
        <div>
            <h2>Mechanics</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {mechanics.map((mechanic, index) => (
                        <tr key={index}>
                            <td>{mechanic.name}</td>
                            <td>{mechanic.email}</td>
                            <td>{mechanic.phone}</td>
                            <td>{mechanic.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/appointments')} style={{ position: 'absolute', top: '20%', left: '80%', transform: 'translate(0%, 0%)', padding: '10px 20px', fontSize: '16px' }}>
                Search
            </button>
        </div>
    );
};

export default Mechanics;
