import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css'; // Ensure this CSS file includes the .ellipsis styles

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newJobData, setNewJobData] = useState({ vehicle: '', mechanic: '', serviceType: '', status: 'Scheduled', id: '' });
    const [addJobError, setAddJobError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchColumn, setSearchColumn] = useState('vehicle');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllJobs');
                setJobs(response.data);
            } catch (err) {
                setError(err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const deleteJob = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/shopWizard/deleteJob?id=${id}`);
            setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
        } catch (err) {
            console.error('Failed to delete job:', err);
        }
    };

    const confirmDeleteJob = (id) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            deleteJob(id);
        }
    };

    const toggleJobStatus = async (job) => {
        // Prevent toggling the status if it is already "Completed"
        if (job.status === 'Completed') {
            console.log('Job is already completed and cannot be changed.');
            return; // Exit the function if the status is "Completed"
        }

        // Determine the new status based on the current status
        let newStatus = '';
        switch (job.status) {
            case 'Scheduled':
                newStatus = 'In Progress';
                break;
            case 'In Progress':
                newStatus = 'Completed';
                break;
            default:
                newStatus = 'Scheduled'; // Default to Scheduled if something unexpected occurs
                break;
        }

        try {
            const response = await axios.put(`http://127.0.0.1:5000/shopWizard/updateJob`, {
                id: job.id,
                vehicle: job.vehicle,
                mechanic: job.mechanic,
                serviceType: job.serviceType,
                status: newStatus
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            // Update the jobs state with the new status for the modified job
            setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
        } catch (err) {
            console.error('Failed to toggle job status:', err);
            setError(err.message || 'Failed to toggle status. Please try again.');
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortJobs();
    };

    const sortJobs = () => {
        let sortedJobs = [...jobs];
        if (sortConfig !== null) {
            sortedJobs.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        setJobs(sortedJobs);
    };

    const getSortDirectionSymbol = (name) => {
        if (sortConfig.key === name) {
            return sortConfig.direction === 'ascending' ? '⮝' : '⮟';
        }
        return '-'; // Default symbol when not sorted
    };

    const handleAddModalInputChange = (field, value) => {
        setNewJobData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleAddJob = async () => {
        const { vehicle, mechanic, serviceType, status, id } = newJobData;
        try {
            const response = await axios.post('http://127.0.0.1:5000/shopWizard/addJob', {
                vehicle: vehicle,
                mechanic: mechanic,
                serviceType: serviceType,
                status: status,
                id: id
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setJobs(prevJobs => [...prevJobs, { vehicle, mechanic, serviceType, status, id }]);
            setNewJobData({ vehicle: '', mechanic: '', serviceType: '', status: 'Scheduled', id: '' });
            setShowAddModal(false);
            setAddJobError(null);
        } catch (err) {
            console.error('Failed to add job:', err);
            setAddJobError(err.message || 'Failed to add job. Please try again.');
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

    const filteredJobs = jobs.filter(job => {
        const searchValue = searchQuery.toLowerCase();
        const fieldValue = job[searchColumn].toLowerCase();
        return fieldValue.includes(searchValue);
    });

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Job List</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search Job..."
                    value={searchQuery}
                    onChange={e => handleSearchInputChange(e.target.value)}
                />
                <select value={searchColumn} onChange={e => handleSearchColumnChange(e.target.value)}>
                    <option value="vehicle">Vehicle</option>
                    <option value="mechanic">Mechanic</option>
                    <option value="serviceType">Service Type</option>
                    <option value="status">Status</option>
                    <option value="id">ID</option>
                </select>
                <button onClick={clearSearch} style={{ marginRight: '5%' }}>Clear</button>
                <button onClick={() => setShowAddModal(true)}>Add Job</button>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('id')} style={{ cursor: 'pointer'}}>
                                ID {getSortDirectionSymbol('id')}
                            </th>
                            <th onClick={() => requestSort('vehicle')} style={{ cursor: 'pointer'}}>
                                Vehicle {getSortDirectionSymbol('vehicle')}
                            </th>
                            <th onClick={() => requestSort('mechanic')} style={{ cursor: 'pointer'}}>
                                Mechanic {getSortDirectionSymbol('mechanic')}
                            </th>
                            <th onClick={() => requestSort('serviceType')} style={{ cursor: 'pointer'}}>
                                service Type {getSortDirectionSymbol('serviceType')}
                            </th>
                            <th onClick={() => requestSort('status')} style={{ cursor: 'pointer'}}>
                                Status {getSortDirectionSymbol('status')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6">Loading...</td></tr>
                        ) : (
                            filteredJobs.map((job, index) => (
                                <tr key={index}>
                                    <td>{job.id}</td>
                                    <td className="ellipsis">{job.vehicle}</td>
                                    <td>{job.mechanic}</td>
                                    <td>{job.serviceType}</td>
                                    <td>{job.status}</td>
                                    <td>
                                        <button onClick={() => toggleJobStatus(job)}>Toggle Status</button>
                                        <button onClick={() => confirmDeleteJob(job.id)}>Delete</button>
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
                        <h2>Add Job</h2>
                        <div>
                            <label>Vehicle:</label>
                            <input type="text" value={newJobData.vehicle} onChange={e => handleAddModalInputChange('vehicle', e.target.value)} />
                        </div>
                        <div>
                            <label>Mechanic:</label>
                            <input type="text" value={newJobData.mechanic} onChange={e => handleAddModalInputChange('mechanic', e.target.value)} />
                        </div>
                        <div>
                            <label>Service Type:</label>
                            <input type="text" value={newJobData.serviceType} onChange={e => handleAddModalInputChange('serviceType', e.target.value)} />
                        </div>
                        <div>
                            <label>Status:</label>
                            <input type="text" value={newJobData.status} onChange={e => handleAddModalInputChange('status', e.target.value)} />
                        </div>
                        <div>
                            {addJobError && <p className="error-message">{addJobError}</p>}
                        </div>
                        <div className="button-container">
                            <button onClick={handleAddJob}>Add Job</button>
                            <button onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobList;