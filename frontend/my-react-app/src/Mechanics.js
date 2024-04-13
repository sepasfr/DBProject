import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mechanics = () => {
    console.log("Mechanics component is rendering");

    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchMechanics = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAllMechanics');
                setMechanics(response.data);
            } catch (err) {
                const errorResponse = err.response ? `${err.response.status} ${err.response.statusText}` : err.message;
                console.error('Error fetching mechanics:', errorResponse);
                setError(errorResponse);
            } finally {
                setLoading(false);
            }
        };

        fetchMechanics();
    }, []);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortArray(key, direction);
    };

    const sortArray = (key, order = 'ascending') => {
        const sortedMechanics = [...mechanics].sort((a, b) => {
            if (a[key] < b[key]) {
                return order === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return order === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setMechanics(sortedMechanics);
    };

    const getSortDirectionSymbol = (name) => {
        if (sortConfig.key !== name) {
            return '-';
        }
        return sortConfig.direction === 'ascending' ? '⮝' : '⮟';
    };

    if (loading) return <p>Loading mechanics...</p>;
    if (error) return <p>Error fetching mechanics: {error}</p>;

    return (
        <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
            <h2>Mechanic List</h2>
            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 10px', margin: 'auto' }}>
                <thead>
                    <tr>
                        <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => requestSort('name')}>
                            Name {getSortDirectionSymbol('name')}
                        </th>
                        <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => requestSort('email')}>
                            Email {getSortDirectionSymbol('email')}
                        </th>
                        <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => requestSort('phone')}>
                            Phone {getSortDirectionSymbol('phone')}
                        </th>
                        <th style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => requestSort('id')}>
                            ID {getSortDirectionSymbol('id')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {mechanics.map(mechanic => (
                        <tr key={mechanic.id}>
                            <td>{mechanic.name}</td>
                            <td>{mechanic.email}</td>
                            <td>{mechanic.phone}</td>
                            <td>{mechanic.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Mechanics;
