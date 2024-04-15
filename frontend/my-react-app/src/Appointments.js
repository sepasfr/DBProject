import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css'; // Ensure this CSS file includes the .ellipsis styles

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
    const [editAppointmentData, setEditAppointmentData] = useState(null);
    const [editAppointmentError, setEditAppointmentError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAppointmentData, setNewAppointmentData] = useState({ day: '', customer: '', vehicle: '', serviceType: '', note: '' });
    const [addAppointmentError, setAddAppointmentError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchColumn, setSearchColumn] = useState('day');
    const [originalData, setOriginalData] = useState(null);


    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllAppointments');
                setAppointments(response.data);
            } catch (err) {
                setError(err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const deleteAppointment = async (id) => {
        await axios.delete(`http://127.0.0.1:5000/shopWizard/removeAppointment?id=${id}`);
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    };

    const confirmDeleteAppointment = (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            deleteAppointment(id);
        }
    };

    const openEditModal = (appointment) => {
        // Ensure the date format is correct for the datetime-local input element
        const formattedDay = new Date(appointment.day).toISOString().slice(0, 16);
        setEditAppointmentData({ ...appointment, day: formattedDay });
        setOriginalData(appointment); // Store original data separately
    };


    const closeEditModal = () => {
        setEditAppointmentData(null);
        setOriginalData(null); // Also clear the original data
    };

    const handleEditChange = (field, value) => {
        setEditAppointmentData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const saveEditAppointment = async () => {
        const { id, customer, vehicle, serviceType, note } = editAppointmentData;
        let { day } = editAppointmentData;

        // Ensure the day is in the correct MySQL datetime format
        if (day) {
            // Check if the day has been edited and is valid
            // Convert from ISO string to MySQL datetime format
            let parsedDate = new Date(day);
            if (!isNaN(parsedDate.getTime())) {
                day = parsedDate.toISOString().slice(0, 19).replace('T', ' ');
            } else {
                throw new Error("Invalid date provided.");
            }
        } else {
            day = originalData.day;  // Fallback to the original day if no new date is provided
        }

        try {
            const response = await axios.put('http://127.0.0.1:5000/shopWizard/updateAppointment', {
                id,
                day,
                customer,
                vehicle,
                serviceType,
                note
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            // Update appointments list and close modal
            setAppointments(prevAppointments => prevAppointments.map(appointment =>
                appointment.id === id ? { ...appointment, day, customer, vehicle, serviceType, note } : appointment
            ));
            closeEditModal();
        } catch (err) {
            setEditAppointmentError(err.message || 'Failed to edit appointment. Please try again.');
        }
    };




    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortAppointments(key, direction);
    };

    const sortAppointments = (key, direction) => {
        const sortedAppointments = [...appointments].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setAppointments(sortedAppointments);
    };

    const handleAddModalInputChange = (field, value) => {
        setNewAppointmentData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleAddAppointment = async () => {
        const { day, customer, vehicle, serviceType, note } = newAppointmentData;
        const formattedDay = day.replace('T', ' ') + ':00'; // Add seconds to match MySQL format
        try {
            const response = await axios.post('http://127.0.0.1:5000/shopWizard/addAppointment', {
                day: formattedDay,
                customer: customer,
                vehicle: vehicle,
                serviceType: serviceType,
                note: note
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setAppointments(prevAppointments => [...prevAppointments, { day, customer, vehicle, serviceType, note }]);
            setNewAppointmentData({ day: '', customer: '', vehicle: '', serviceType: '', note: '' });
            setShowAddModal(false);
            setAddAppointmentError(null);
        } catch (err) {
            setAddAppointmentError(err.message || 'Failed to add appointment. Please try again.');
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

    const filteredAppointments = appointments.filter(appointment => {
        const searchValue = searchQuery.toLowerCase();
        const fieldValue = appointment[searchColumn].toLowerCase();
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
            <h2>Appointment List</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search Appointment..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                />
                <select value={searchColumn} onChange={(e) => handleSearchColumnChange(e.target.value)}>
                    <option value="id">Id</option>
                    <option value="day">Day</option>
                    <option value="customer">Customer</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="serviceType">Service Type</option>
                    <option value="note">Note</option>
                </select>
                <button onClick={clearSearch} style={{ marginRight: '5%' }}>Clear</button>
                <button onClick={() => setShowAddModal(true)}>Add Appointment</button>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                                Id {getSortDirectionSymbol('id')}
                            </th>
                            <th onClick={() => requestSort('day')} style={{ cursor: 'pointer' }}>
                                Day {getSortDirectionSymbol('day')}
                            </th>
                            <th onClick={() => requestSort('customer')} style={{ cursor: 'pointer' }}>
                                Customer {getSortDirectionSymbol('customer')}
                            </th>
                            <th onClick={() => requestSort('vehicle')} style={{ cursor: 'pointer' }}>
                                Vehicle {getSortDirectionSymbol('vehicle')}
                            </th>
                            <th onClick={() => requestSort('serviceType')} style={{ cursor: 'pointer' }}>
                                Service Type {getSortDirectionSymbol('serviceType')}
                            </th>
                            <th onClick={() => requestSort('note')} style={{ cursor: 'pointer' }}>
                                Note {getSortDirectionSymbol('note')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6">Loading...</td></tr>
                        ) : (
                            filteredAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.day}</td>
                                    <td>{appointment.customer}</td>
                                    <td>{appointment.vehicle}</td>
                                    <td>{appointment.serviceType}</td>
                                    <td>{appointment.note}</td>
                                    <td>
                                        <button onClick={() => openEditModal(appointment)}>Edit</button>
                                        <button onClick={() => confirmDeleteAppointment(appointment.id)}>Delete</button>
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
                        <h2>Add Appointment</h2>
                        <div>
                            <input
                                type="datetime-local"
                                value={editAppointmentData.day ? editAppointmentData.day.slice(0, 16) : ''}
                                onChange={(e) => handleEditChange('day', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Customer:</label>
                            <input type="text" value={newAppointmentData.customer} onChange={(e) => handleAddModalInputChange('customer', e.target.value)} />
                        </div>
                        <div>
                            <label>Vehicle:</label>
                            <input type="text" value={newAppointmentData.vehicle} onChange={(e) => handleAddModalInputChange('vehicle', e.target.value)} />
                        </div>
                        <div>
                            <label>Service Type:</label>
                            <input type="text" value={newAppointmentData.serviceType} onChange={(e) => handleAddModalInputChange('serviceType', e.target.value)} />
                        </div>
                        <div>
                            <label>Note:</label>
                            <input type="text" value={newAppointmentData.note} onChange={(e) => handleAddModalInputChange('note', e.target.value)} />
                        </div>
                        <div>
                            {addAppointmentError && <p className="error-message">{addAppointmentError}</p>}
                        </div>
                        <div className="button-container">
                            <button onClick={handleAddAppointment}>Add Appointment</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {editAppointmentData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Appointment</h2>
                        <div>
                            <label>Day:</label>
                            <input
                                type="datetime-local"
                                value={editAppointmentData.day.slice(0, 16)} // Assuming the day is stored in ISO format
                                onChange={(e) => handleEditChange('day', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Customer:</label>
                            <input type="text" value={editAppointmentData.customer} onChange={(e) => handleEditChange('customer', e.target.value)} />
                        </div>
                        <div>
                            <label>Vehicle:</label>
                            <input type="text" value={editAppointmentData.vehicle} onChange={(e) => handleEditChange('vehicle', e.target.value)} />
                        </div>
                        <div>
                            <label>Service Type:</label>
                            <input type="text" value={editAppointmentData.serviceType} onChange={(e) => handleEditChange('serviceType', e.target.value)} />
                        </div>
                        <div>
                            <label>Note:</label>
                            <input type="text" value={editAppointmentData.note} onChange={(e) => handleEditChange('note', e.target.value)} />
                        </div>
                        <div className="button-container">
                            <button onClick={() => saveEditAppointment()}>Save</button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>
                        {editAppointmentError && <p className="error-message">{editAppointmentError}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
