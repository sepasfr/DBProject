import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Modal.css';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
    const [editVehicleData, setEditVehicleData] = useState(null);
    const [editVehicleError, setEditVehicleError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVehicleData, setNewVehicleData] = useState({ vin: '', owner: '', make: '', model: '', color: '', year: '' });
    const [addVehicleError, setAddVehicleError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchColumn, setSearchColumn] = useState('model');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllVehicles');
                setVehicles(response.data);
            } catch (err) {
                setError(err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const deleteVehicle = async (vin) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/shopWizard/removeVehicle?vin=${vin}`);
            setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.vin !== vin));
        } catch (err) {
            console.error('Failed to delete vehicle:', err);
        }
    };

    const confirmDeleteVehicle = (vin) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            deleteVehicle(vin);
        }
    };

    const openEditModal = (vehicle) => {
        setEditVehicleData({ ...vehicle, oldVin: vehicle.vin });
    };

    const closeEditModal = () => {
        setEditVehicleData(null);
    };

    const handleEditChange = (field, value) => {
        setEditVehicleData(prev => ({ ...prev, [field]: value }));
    };

    

    const saveEditVehicle = async () => {
        const { oldVin, vin, owner, make, model, color, year } = editVehicleData;
        try {
            const response = await axios.put('http://127.0.0.1:5000/shopWizard/updateVehicle', {
                old_vin: oldVin,
                new_vin: vin,
                owner: owner,
                make: make,
                model: model,
                color: color,
                year: year
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setVehicles(prevVehicles => prevVehicles.map(vehicle => vehicle.vin === oldVin ? { ...vehicle, vin, owner, make, model, color, year } : vehicle));
            closeEditModal();
        } catch (err) {
            console.error('Failed to edit vehicle:', err);
            setEditVehicleError(err.message || 'Failed to edit vehicle. Please try again.');
        }
    };

    const handleAddModalInputChange = (field, value) => {
        setNewVehicleData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleAddVehicle = async () => {
        const { vin, owner, make, model, color, year } = newVehicleData;
        try {
            const response = await axios.post('http://127.0.0.1:5000/shopWizard/addVehicle', {
                vin: vin,
                owner: owner,
                make: make,
                model: model,
                color: color,
                year: year
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setVehicles(prevVehicles => [...prevVehicles, { vin, owner, make, model, color, year }]);
            setNewVehicleData({ vin: '', owner: '', make: '', model: '', color: '', year: '' });
            setShowAddModal(false);
            setAddVehicleError(null);
        } catch (err) {
            console.error('Failed to add vehicle:', err);
            setAddVehicleError(err.message || 'Failed to add vehicle. Please try again.');
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

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortVehicles(key, direction);
    };

    const sortVehicles = (key, direction) => {
        const sortedVehicles = [...vehicles].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setVehicles(sortedVehicles);
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const searchValue = searchQuery.toLowerCase();
        const fieldValue = vehicle[searchColumn].toLowerCase();
        return fieldValue.includes(searchValue);
    });

    const getSortDirectionSymbol = (name) => {
        if (sortConfig.key === name) {
            return sortConfig.direction === 'ascending' ? '⮝' : '⮟';
        }
        return '-'; // Default symbol when not sorted
    };    

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Vehicle List</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search Vehicle..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                />
                <select value={searchColumn} onChange={(e) => handleSearchColumnChange(e.target.value)}>
                    <option value="vin">VIN</option>
                    <option value="owner">Owner</option>
                    <option value="make">Make</option>
                    <option value="model">Model</option>
                    <option value="color">Color</option>
                    <option value="year">Year</option>
                </select>
                <button onClick={clearSearch} style={{ marginRight: '5%' }}>Clear</button>
                <button onClick={() => setShowAddModal(true)}>Add Vehicle</button>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('vin')} style={{ cursor: 'pointer' }}>
                                VIN {getSortDirectionSymbol('vin')}
                            </th>
                            <th onClick={() => requestSort('owner')} style={{ cursor: 'pointer' }}>
                                Owner {getSortDirectionSymbol('owner')}
                            </th>
                            <th onClick={() => requestSort('make')} style={{ cursor: 'pointer' }}>
                                Make {getSortDirectionSymbol('make')}
                            </th>
                            <th onClick={() => requestSort('model')} style={{ cursor: 'pointer' }}>
                                Model {getSortDirectionSymbol('model')}
                            </th>
                            <th onClick={() => requestSort('color')} style={{ cursor: 'pointer' }}>
                                Color {getSortDirectionSymbol('color')}
                            </th>
                            <th onClick={() => requestSort('year')} style={{ cursor: 'pointer' }}>
                                Year {getSortDirectionSymbol('year')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7">Loading...</td></tr>
                        ) : filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle, index) => (
                                <tr key={index}>
                                    <td className="ellipsis">{vehicle.vin}</td>
                                    <td className="ellipsis">{vehicle.owner}</td>
                                    <td className="ellipsis">{vehicle.make}</td>
                                    <td className="ellipsis">{vehicle.model}</td>
                                    <td className="ellipsis">{vehicle.color}</td>
                                    <td className="ellipsis">{vehicle.year}</td>
                                    <td>
                                        <button onClick={() => openEditModal(vehicle)}>Edit</button>
                                        <button onClick={() => confirmDeleteVehicle(vehicle.vin)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7">No vehicles found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {error && <p>Error: {error}</p>}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Vehicle</h2>
                        <div>
                            <label>VIN:</label>
                            <input type="text" value={newVehicleData.vin} onChange={(e) => handleAddModalInputChange('vin', e.target.value)} />
                        </div>
                        <div>
                            <label>Owner:</label>
                            <input type="text" value={newVehicleData.owner} onChange={(e) => handleAddModalInputChange('owner', e.target.value)} />
                        </div>
                        <div>
                            <label>Make:</label>
                            <input type="text" value={newVehicleData.make} onChange={(e) => handleAddModalInputChange('make', e.target.value)} />
                        </div>
                        <div>
                            <label>Model:</label>
                            <input type="text" value={newVehicleData.model} onChange={(e) => handleAddModalInputChange('model', e.target.value)} />
                        </div>
                        <div>
                            <label>Color:</label>
                            <input type="text" value={newVehicleData.color} onChange={(e) => handleAddModalInputChange('color', e.target.value)} />
                        </div>
                        <div>
                            <label>Year:</label>
                            <input type="number" value={newVehicleData.year} onChange={(e) => handleAddModalInputChange('year', e.target.value)} />
                        </div>
                        <div>
                            {addVehicleError && <p className="error-message">{addVehicleError}</p>}
                        </div>
                        <div className="button-container">
                            <button onClick={handleAddVehicle}>Add Vehicle</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {editVehicleData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Vehicle</h2>
                        <div>
                            <label>VIN:</label>
                            <input type="text" value={editVehicleData.vin} onChange={(e) => handleEditChange('vin', e.target.value)} />
                        </div>
                        <div>
                            <label>Owner:</label>
                            <input type="text" value={editVehicleData.owner} onChange={(e) => handleEditChange('owner', e.target.value)} />
                        </div>
                        <div>
                            <label>Make:</label>
                            <input type="text" value={editVehicleData.make} onChange={(e) => handleEditChange('make', e.target.value)} />
                        </div>
                        <div>
                            <label>Model:</label>
                            <input type="text" value={editVehicleData.model} onChange={(e) => handleEditChange('model', e.target.value)} />
                        </div>
                        <div>
                            <label>Color:</label>
                            <input type="text" value={editVehicleData.color} onChange={(e) => handleEditChange('color', e.target.value)} />
                        </div>
                        <div>
                            <label>Year:</label>
                            <input type="number" value={editVehicleData.year} onChange={(e) => handleEditChange('year', e.target.value)} />
                        </div>
                        <div className="button-container">
                            <button onClick={saveEditVehicle}>Save</button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>
                        {editVehicleError && <p className="error-message">{editVehicleError}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehicles;