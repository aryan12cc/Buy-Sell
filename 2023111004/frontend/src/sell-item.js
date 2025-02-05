import React, { useState, useEffect } from 'react';
import styles from './sell-item.module.css';
import './navbar.css';

function SellItem() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessageColor, setStatusMessageColor] = useState('');
    useEffect(() => {
            const fetchUserData = async () => {
                const token = localStorage.getItem('token');
                if(!token) {
                    window.location.href = '/login.html';
                    return;
                }
                try {
                    const response = await fetch('http://localhost:5001/api/user-details', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    });
    
                    if(response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                    } 
                    else {
                        localStorage.removeItem('token');
                        window.location.href = '/login.html';
                    }
                } 
                catch(error) {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token');
                } 
                finally {
                    setLoading(false);
                }
            };
    
            fetchUserData();
        }, []);
    
    if(loading) {
        return <div>Loading...</div>;
    }

    const handleLogout = async() => {
        try {
            const response = await fetch('http://localhost:5001/api/logout-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if(response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
            }
            else {

            }
        }
        catch (error) {

        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
        
        const response = await fetch('http://localhost:5001/api/item-operations/sell-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(formData),
        });
        if(response.ok) {
            setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
            });
            setStatusMessage('Item submitted successfully');
            setStatusMessageColor('green');
        }  
        else {
            setStatusMessage('Error submitting item');
            setStatusMessageColor('red');
            if(response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
            }
        }
    };

    const categoryList = ['Electronics', 'Clothing', 'Books', 'Food', 'General'];
    const fields = [
        { label: 'Name', name: 'name', type: 'text', required: true },
        { label: 'Price (in INR)', name: 'price', type: 'number', required: true, min: 1 },
        { label: 'Description', name: 'description', type: 'textarea', rows: 5, required: true },
    ];

    return (
        <div className={styles.root}>
            <div className="navbar">
                <div className="navbar-left">
                    <a href="profile.html">Profile</a>
                    <a href="sell-item.html">Sell</a>
                    <a href="pending-deliveries.html">Pending Deliveries</a>
                    <a href="catalogue.html">Catalogue</a>
                    <a href="history.html">Order history</a>
                    <a href="cart.html">Cart</a>
                    <a href="support.html">Chatbot Support</a>
                </div>
                <div className="navbar-right">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <h1>Sell An Item</h1>
                <form className="{styles.itemForm}" onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className={styles.formField}>
                            <label htmlFor={field.name}>{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    rows={field.rows}
                                    required={field.required}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    required={field.required}
                                    min={field.min}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>
                    ))}
                    <div className={styles.inputField}>
                        <label>Category:</label>
                        {categoryList.map((category) => (
                            <div key={category} className={styles.checkboxField}>
                                <input
                                    type="radio"
                                    id={category}
                                    name="category"
                                    value={category}
                                    checked={formData.category === category}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor={category}>{category}</label>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>
                </form>
                {statusMessage && (
                    <div 
                        style={{
                            marginTop: '20px',
                            color: statusMessageColor,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SellItem;