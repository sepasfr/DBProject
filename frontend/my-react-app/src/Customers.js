import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css'; // Assuming we're using the same modal styling as Mechanics

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
    const [editCustomerData, setEditCustomerData] = useState(null);
    const [editCustomerError, setEditCustomerError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({ name: '', email: '', phone: '' });
    const [addCustomerError, setAddCustomerError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchColumn, setSearchColumn] = useState('name');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllCustomers');
                setCustomers(response.data);
            } catch (err) {
                setError(err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
                console.error('Error fetching customers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const deleteCustomer = async (phone) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/shopWizard/removeCustomer?phone=${phone}`);
            setCustomers(prevCustomers => prevCustomers.filter(customer => customer.phone !== phone));
        } catch (err) {
            console.error('Failed to delete customer:', err);
        }
    };

    const confirmDeleteCustomer = (phone) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            deleteCustomer(phone);
        }
    };

    const openEditModal = (customer) => {
        setEditCustomerData({ ...customer, originalPhone: customer.phone });
    };

    const closeEditModal = () => {
        setEditCustomerData(null);
    };

    const handleEditChange = (field, value) => {
        setEditCustomerData(prev => ({ ...prev, [field]: value }));
    };

    const saveEditCustomer = async () => {
        const { name, email, phone, originalPhone } = editCustomerData;
        try {
            const response = await axios.put('http://127.0.0.1:5000/shopWizard/updateCustomer', {
                name: name,
                email: email,
                new_phone: phone,
                old_phone: originalPhone
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setCustomers(prevCustomers => prevCustomers.map(customer => customer.phone === originalPhone ? editCustomerData : customer));
            closeEditModal();
        } catch (err) {
            console.error('Failed to edit customer:', err);
            setEditCustomerError(err.message || 'Failed to edit customer. Please try again.');
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortCustomers(key, direction);
    };

    const sortCustomers = (key, direction) => {
        const sortedCustomers = [...customers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setCustomers(sortedCustomers);
    };

    const handleAddModalInputChange = (field, value) => {
        setNewCustomerData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleAddCustomer = async () => {
        const { name, email, phone } = newCustomerData;
        try {
            const response = await axios.post('http://127.0.0.1:5000/shopWizard/addCustomer', {
                name: name,
                email: email,
                phone: phone
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setCustomers(prevCustomers => [...prevCustomers, newCustomerData]);
            setNewCustomerData({ name: '', email: '', phone: '' });
            setShowAddModal(false);
            setAddCustomerError(null);
        } catch (err) {
            console.error('Failed to add customer:', err);
            setAddCustomerError(err.message || 'Failed to add customer. Please try again.');
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

    const filteredCustomers = customers.filter(customer => {
        const searchValue = searchQuery.toLowerCase();
        const fieldValue = customer[searchColumn].toLowerCase();
        return fieldValue.includes(searchValue);
    });

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Customer List</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search Customer..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                />
                <select value={searchColumn} onChange={(e) => handleSearchColumnChange(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                </select>
                <button onClick={clearSearch} style={{ marginRight: '5%' }}>Clear</button>
                <button onClick={() => setShowAddModal(true)}>Add Customer</button>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '⮝' : '⮟')}</th>
                            <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '⮝' : '⮟')}</th>
                            <th onClick={() => requestSort('phone')} style={{ cursor: 'pointer' }}>Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'ascending' ? '⮝' : '⮟')}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Loading...</td></tr>
                        ) : (
                            filteredCustomers.map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td>
                                        <button onClick={() => openEditModal(customer)}>Edit</button>
                                        <button onClick={() => confirmDeleteCustomer(customer.phone)}>Delete</button>
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
                        <h2>Add Customer</h2>
                        <div>
                            <label>Name: </label>
                            <input type="text" value={newCustomerData.name} onChange={(e) => handleAddModalInputChange('name', e.target.value)} />
                        </div>
                        <div>
                            <label>Email: </label>
                            <input type="email" value={newCustomerData.email} onChange={(e) => handleAddModalInputChange('email', e.target.value)} />
                        </div>
                        <div>
                            <label>Phone: </label>
                            <input type="tel" value={newCustomerData.phone} onChange={(e) => handleAddModalInputChange('phone', e.target.value)} />
                        </div>
                        <div>
                            {addCustomerError && <p className="error-message">{addCustomerError}</p>}
                        </div>
                        <div className="button-container">
                            <button onClick={handleAddCustomer}>Add Customer</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {editCustomerData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Customer</h2>
                        <div>
                            <label>Name: </label>
                            <input type="text" value={editCustomerData.name} onChange={(e) => handleEditChange('name', e.target.value)} />
                        </div>
                        <div>
                            <label>Email: </label>
                            <input type="email" value={editCustomerData.email} onChange={(e) => handleEditChange('email', e.target.value)} />
                        </div>
                        <div>
                            <label>Phone: </label>
                            <input type="tel" value={editCustomerData.phone} onChange={(e) => handleEditChange('phone', e.target.value)} />
                        </div>
                        <div>
                            {editCustomerError && <p className="error-message">{editCustomerError}</p>}
                        </div>
                        <div className="button-container">
                            <button onClick={saveEditCustomer}>Save</button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
