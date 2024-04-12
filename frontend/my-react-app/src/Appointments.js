import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                //Temporary link, Idk what the final link is gonna be 
                const response = await axios.get('http://127.0.0.1:5000/shopWizard/getAppointments');
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div>
            <h2>Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Service Type</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment, index) => (
                        <tr key={index}>
                            <td>{appointment.day}</td>
                            <td>{appointment.customer}</td>
                            <td>{appointment.vehicle}</td>
                            <td>{appointment.serviceType}</td>
                            <td>{appointment.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Appointments;
