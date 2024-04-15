import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css'; // Ensure this CSS file includes the .ellipsis styles

const ServicePricing = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
    const [editServiceData, setEditServiceData] = useState(null);
    const [editServiceError, setEditServiceError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newServiceData, setNewServiceData] = useState({ id: '', name: '', cost: '', duration: '' });
    const [addServiceError, setAddServiceError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchColumn, setSearchColumn] = useState('name');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllServiceTypes');
                setServices(response.data);
            } catch (err) {
                setError(err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const deleteService = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/shopWizard/removeServiceType?id=${id}`);
            setServices(prevServices => prevServices.filter(service => service.id !== id));
        } catch (err) {
            console.error('Failed to delete service:', err);
        }
    };

    const confirmDeleteService = (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            deleteService(id);
        }
    };

    const openEditModal = (service) => {
        setEditServiceData({ ...service, oldId: service.id });
    };

    const closeEditModal = () => {
        setEditServiceData(null);
    };

    const handleEditChange = (field, value) => {
        setEditServiceData(prev => ({ ...prev, [field]: value }));
    };

    const saveEditService = async () => {
        const { oldId, id, name, cost, duration } = editServiceData;
        try {
            const response = await axios.put('http://127.0.0.1:5000/shopWizard/updateServiceType', {
                old_id: oldId,
                new_id: id,
                name: name,
                cost: cost,
                duration: duration
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setServices(prevServices => prevServices.map(service => service.id === oldId ? { ...service, id, name, cost, duration } : service));
            closeEditModal();
        } catch (err) {
            console.error('Failed to edit service:', err);
            setEditServiceError(err.message || 'Failed to edit service. Please try again.');
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortServices(key, direction);
    };

    const sortServices = (key, direction) => {
        const sortedServices = [...services].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setServices(sortedServices);
    };

    const handleAddModalInputChange = (field, value) => {
        setNewServiceData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleAddService = async () => {
        const { id, name, cost, duration } = newServiceData;
        try {
            const response = await axios.post('http://127.0.0.1:5000/shopWizard/addServiceType', {
                id: id,
                name: name,
                cost: cost,
                duration: duration
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setServices(prevServices => [...prevServices, { id, name, cost, duration }]);
            setNewServiceData({ id: '', name: '', cost: '', duration: '' });
            setShowAddModal(false);
            setAddServiceError(null);
        } catch (err) {
            console.error('Failed to add service:', err);
            setAddServiceError(err.message || 'Failed to add service. Please try again.');
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

    const filteredServices = services.filter(service => {
        const searchValue = searchQuery.toLowerCase();
        const fieldValue = service[searchColumn].toLowerCase();
        return fieldValue.includes(searchValue);
    });

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Service Pricing List</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search Service..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                />
                <select value={searchColumn} onChange={(e) => handleSearchColumnChange(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="cost">Cost</option>
                    <option value="duration">Duration</option>
                    <option value="id">ID</option>
                </select>
                <button onClick={clearSearch} style={{ marginRight: '5%' }}>Clear</button>
                <button onClick={() => setShowAddModal(true)}>Add Service</button>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Name</th>
                            <th onClick={() => requestSort('cost')} style={{ cursor: 'pointer' }}>Cost</th>
                            <th onClick={() => requestSort('duration')} style={{ cursor: 'pointer' }}>Duration</th>
                            <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Loading...</td></tr>
                        ) : (
                            filteredServices.map((service, index) => (
                                <tr key={index}>
                                    <td className="ellipsis">{service.name}</td>
                                    <td className="ellipsis">{service.cost}</td>
                                    <td className="ellipsis">{service.duration}</td>
                                    <td className="ellipsis">{service.id}</td>
                                    <td>
                                        <button onClick={() => openEditModal(service)}>Edit</button>
                                        <button onClick={() => confirmDeleteService(service.id)}>Delete</button>
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
                        <h2>Add Service</h2>
                        <div>
                            <label>ID:</label>
                            <input type="text" value={newServiceData.id} onChange={(e) => handleAddModalInputChange('id', e.target.value)} />
                        </div>
                        <div>
                            <label>Name:</label>
                            <input type="text" value={newServiceData.name} onChange={(e) => handleAddModalInputChange('name', e.target.value)} />
                        </div>
                        <div>
                            <label>Cost:</label>
                            <input type="text" value={newServiceData.cost} onChange={(e) => handleAddModalInputChange('cost', e.target.value)} />
                        </div>
                        <div>
                            <label>Duration:</label>
                            <input type="text" value={newServiceData.duration} onChange={(e) => handleAddModalInputChange('duration', e.target.value)} />
                        </div>
                        <div className="button-container">
                            <button onClick={handleAddService}>Add Service</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                        {addServiceError && <p className="error-message">{addServiceError}</p>}
                    </div>
                </div>
            )}
            {editServiceData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Service</h2>
                        <div>
                            <label>ID:</label>
                            <input type="text" value={editServiceData.id} onChange={(e) => handleEditChange('id', e.target.value)} />
                        </div>
                        <div>
                            <label>Name:</label>
                            <input type="text" value={editServiceData.name} onChange={(e) => handleEditChange('name', e.target.value)} />
                        </div>
                        <div>
                            <label>Cost:</label>
                            <input type="text" value={editServiceData.cost} onChange={(e) => handleEditChange('cost', e.target.value)} />
                        </div>
                        <div>
                            <label>Duration:</label>
                            <input type="text" value={editServiceData.duration} onChange={(e) => handleEditChange('duration', e.target.value)} />
                        </div>
                        <div className="button-container">
                            <button onClick={saveEditService}>Save</button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>
                        {editServiceError && <p className="error-message">{editServiceError}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicePricing;