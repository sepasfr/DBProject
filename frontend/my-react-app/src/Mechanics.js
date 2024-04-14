import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css'; // Import the CSS file for modal styling

const MechanicList = () => {
    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
    const [editMechanicData, setEditMechanicData] = useState(null);
    const [editMechanicError, setEditMechanicError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMechanicData, setNewMechanicData] = useState({ name: '', email: '', phone: '', id: '' });
    const [addMechanicError, setAddMechanicError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchColumn, setSearchColumn] = useState('name');

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
            // Delete the existing mechanic
            await deleteMechanic(id);

            // Attempt to add the edited mechanic
            const response = await axios.get(uri);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setMechanics(prevMechanics => [...prevMechanics, editMechanicData]);
            closeEditModal();
        } catch (err) {
            console.error('Failed to edit mechanic:', err);
            setEditMechanicError(err.message || 'Failed to edit mechanic. Please try again.');
        }
    };
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascendingF') {
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

    const handleAddModalInputChange = (field, value) => {
        setNewMechanicData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleAddMechanic = async () => {
        const { name, email, phone, id } = newMechanicData;
        const uri = `http://127.0.0.1:5000/shopWizard/addMechanic?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${phone}&id=${id}`;
        try {
            const response = await axios.get(uri);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setMechanics(prevMechanics => [...prevMechanics, newMechanicData]);
            setNewMechanicData({ name: '', email: '', phone: '', id: '' });
            setShowAddModal(false);
            setAddMechanicError(null);
        } catch (err) {
            console.error('Failed to add mechanic:', err);
            setAddMechanicError(err.message || 'Failed to add mechanic. Please try again.');
        }
    };

    const handleSearchInputChange = (value) => {
        setSearchQuery(value);
    };

    const handleSearchColumnChange = (column) => {
        setSearchColumn(column);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const filteredMechanics = mechanics.filter(mechanic => {
        const searchValue = searchQuery.toLowerCase();
        const fieldValue = mechanic[searchColumn].toLowerCase();
        return fieldValue.includes(searchValue);
    });

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Mechanic List</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search Mechanic..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                />
                <select value={searchColumn} onChange={(e) => handleSearchColumnChange(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="id">ID</option>
                </select>
                <button onClick={clearSearch} style={{ marginRight: '5%' }}>Clear</button>
                <button onClick={() => setShowAddModal(true)}>Add Mechanic</button>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
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
                        {loading ? (
                            <tr><td colSpan="5">Loading...</td></tr>
                        ) : (
                            filteredMechanics.map((mechanic, index) => (
                                <tr key={index}>
                                    <td>{mechanic.name}</td>
                                    <td>{mechanic.email}</td>
                                    <td>{mechanic.phone}</td>
                                    <td>{mechanic.id}</td>
                                    <td>
                                        <button onClick={() => openEditModal(mechanic)}>Edit</button>
                                        <button onClick={() => deleteMechanic(mechanic.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {error && <p>Error: {error}</p>}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Mechanic</h2>
                        <div>
                            <label>Name: </label>
                            <input type="text" value={newMechanicData.name} onChange={(e) => handleAddModalInputChange('name', e.target.value)} />
                        </div>
                        <div>
                            <label>Email: </label>
                            <input type="email" value={newMechanicData.email} onChange={(e) => handleAddModalInputChange('email', e.target.value)} />
                        </div>
                        <div>
                            <label>Phone: </label>
                            <input type="tel" value={newMechanicData.phone} onChange={(e) => handleAddModalInputChange('phone', e.target.value)} />
                        </div>
                        <div>
                            <label>ID: </label>
                            <input type="text" value={newMechanicData.id} onChange={(e) => handleAddModalInputChange('id', e.target.value)} />
                        </div>
                        <div>
                            {addMechanicError && <p className="error-message">{addMechanicError}</p>}
                        </div>
                        <div className="button-container">
                            <button onClick={handleAddMechanic}>Add Mechanic</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {editMechanicData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Mechanic</h2>
                        <div>
                            <label>Name: </label>
                            <input type="text" value={editMechanicData.name} onChange={(e) => handleEditChange('name', e.target.value)} />
                        </div>
                        <div>
                            <label>Email: </label>
                            <input type="email" value={editMechanicData.email} onChange={(e) => handleEditChange('email', e.target.value)} />
                        </div>
                        <div>
                            <label>Phone: </label>
                            <input type="tel" value={editMechanicData.phone} onChange={(e) => handleEditChange('phone', e.target.value)} />
                        </div>
                        <div>
                            {editMechanicError && <p className="error-message">{editMechanicError}</p>}
                        </div>
                        <div className='button-container'>
                            <button onClick={saveEditMechanic}>Save</button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default MechanicList;
