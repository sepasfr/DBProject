import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MechanicList = () => {
    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
    const [editMechanicData, setEditMechanicData] = useState(null);

    useEffect(() => {
        const fetchMechanics = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllMechanics');
                setMechanics(response.data);
            } catch (err) {
                setError(`Error: ${err.response ? `${err.response.status} ${err.response.statusText}` : 'Network error'}`);
            } finally {
                setLoading(false);
            }
        };
        fetchMechanics();
    }, []);

    const deleteMechanic = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/shopWizard/removeMechanic/${id}`);
            setMechanics(prevMechanics => prevMechanics.filter(mechanic => mechanic.id !== id));
        } catch (err) {
            setError(`Failed to delete mechanic: ${err.message}`);
            console.error('Error:', err);
        }
    };

    const handleEditChange = (field, value) => {
        setEditMechanicData(prev => ({ ...prev, [field]: value }));
    };

    const saveEditMechanic = async () => {
        const { id, name, email, phone } = editMechanicData;
        try {
            await axios.put(`http://127.0.0.1:5000/shopWizard/updateMechanic/${id}`, { name, email, phone });
            setMechanics(prevMechanics => prevMechanics.map(mech => mech.id === id ? { ...editMechanicData } : mech));
            closeEditModal();
        } catch (err) {
            setError(`Failed to edit mechanic: ${err.message}`);
            console.error('Error:', err);
        }
    };

    const closeEditModal = () => {
        setEditMechanicData(null);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortMechanics(key, direction);
    };

    const sortMechanics = (key, direction) => {
        const sortedMechanics = [...mechanics].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setMechanics(sortedMechanics);
    };

    const getSortDirectionSymbol = (name) => {
        return sortConfig.key === name ? (sortConfig.direction === 'ascending' ? '⮝' : '⮟') : '-';
    };

    if (loading) return <p>Loading mechanics...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Mechanic List</h2>
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        {['name', 'email', 'phone', 'id'].map(field => (
                            <th key={field} onClick={() => requestSort(field)} style={{ cursor: 'pointer' }}>
                                {field.charAt(0).toUpperCase() + field.slice(1)} {getSortDirectionSymbol(field)}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mechanics.map(mechanic => (
                        <tr key={mechanic.id}>
                            <td>{mechanic.name}</td>
                            <td>{mechanic.email}</td>
                            <td>{mechanic.phone}</td>
                            <td>{mechanic.id}</td>
                            <td>
                                <button onClick={() => setEditMechanicData(mechanic)}>Edit</button>
                                <button onClick={() => deleteMechanic(mechanic.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editMechanicData && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000 }}>
                    <h4>Edit Mechanic</h4>
                    {['name', 'email', 'phone'].map(field => (
                        <div key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                value={editMechanicData[field]}
                                onChange={(e) => handleEditChange(field, e.target.value)}
                            /><br />
                        </div>
                    ))}
                    <button onClick={saveEditMechanic}>Save</button>
                    <button onClick={closeEditModal}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default MechanicList;
