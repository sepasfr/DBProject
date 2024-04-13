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
                setError(err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
                console.error('Error fetching mechanics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMechanics();
    }, []);

    const deleteMechanic = async (id) => {
        try {
            await axios.get(`http://127.0.0.1:5000/shopWizard/removeMechanic?id=${id}`);
            setMechanics(prevMechanics => prevMechanics.filter(mechanic => mechanic.id !== id));
        } catch (err) {
            console.error('Failed to delete mechanic:', err);
        }
    };

    const openEditModal = (mechanic) => {
        setEditMechanicData(mechanic);
    };

    const closeEditModal = () => {
        setEditMechanicData(null);
    };

    const handleEditChange = (field, value) => {
        setEditMechanicData(prev => ({ ...prev, [field]: value }));
    };

    const saveEditMechanic = async () => {
        const { id, name, email, phone } = editMechanicData;
        const uri = `http://127.0.0.1:5000/shopWizard/addMechanic?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${phone}&id=${id}`;
        try {
            await axios.get(uri);
            setMechanics(prevMechanics => prevMechanics.map(mech => {
                if (mech.id === id) return {...editMechanicData};
                return mech;
            }));
            closeEditModal();
        } catch (err) {
            console.error('Failed to edit mechanic:', err);
        }
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
        if (sortConfig.key === name) {
            return sortConfig.direction === 'ascending' ? '⮝' : '⮟';
        }
        return '-'; // Default symbol when not sorted
    };

    if (loading) return <p>Loading mechanics...</p>;
    if (error) return <p>Error fetching mechanics: {error}</p>;

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Mechanic List</h2>
            <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Name {getSortDirectionSymbol('name')}</th>
                            <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>Email {getSortDirectionSymbol('email')}</th>
                            <th onClick={() => requestSort('phone')} style={{ cursor: 'pointer' }}>Phone {getSortDirectionSymbol('phone')}</th>
                            <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>ID {getSortDirectionSymbol('id')}</th>
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
                                    <button onClick={() => openEditModal(mechanic)}>Edit</button>
                                    <button onClick={() => deleteMechanic(mechanic.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editMechanicData && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000 }}>
                    <h4>Edit Mechanic</h4>
                    <input type="text" value={editMechanicData.name} onChange={(e) => handleEditChange('name', e.target.value)} /><br />
                    <input type="email" value={editMechanicData.email} onChange={(e) => handleEditChange('email', e.target.value)} /><br />
                    <input type="text" value={editMechanicData.phone} onChange={(e) => handleEditChange('phone', e.target.value)} /><br />
                    <button onClick={saveEditMechanic}>Save</button>
                    <button onClick={closeEditModal}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default MechanicList;
