import React, { useState, useEffect } from 'react';
import styles from './pending-deliveries.module.css';
import './navbar.css';

function PendingDeliveries() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deliveryItems, setDeliveryItems] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessageColor, setStatusMessageColor] = useState('black');
    const [isPageLoaded, setIsPageLoaded] = useState(0);
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

    const fetchDeliveryItems = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/order-operations/pending-deliveries', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if(response.ok) {
                const output = await response.json();
                setDeliveryItems(output.pendingDeliveries);
            }
            else {
                setStatusMessage('Error fetching delivery items');
                setStatusMessageColor('red');
            }
        }
        catch(error) {

        }
    };

    const checkOTP = async(id) => {
        const otpInput = document.querySelector('input[type="number"]').value;
        if(!otpInput) {
            setStatusMessage('Please enter OTP');
            setStatusMessageColor('red');
            return;
        }
        try {
            const response = await fetch('http://localhost:5001/api/order-operations/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ otp: otpInput, orderId: id }),
            });
            if(response.ok) {
                fetchDeliveryItems();
            } 
            else {
                const error = await response.json();
                setStatusMessage(error.message);
                setStatusMessageColor('red');
            }
        } 
        catch(error) {
            setStatusMessage('Error verifying OTP');
            setStatusMessageColor('red');
        }
    }
    if(!loading && isPageLoaded === 0) {
        fetchDeliveryItems();
        setIsPageLoaded(1);
    }

    if(loading) {
        return (<div>Loading...</div>)
    }
    
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
            <h1>Pending Deliveries</h1>
            <div className={styles.container}>
                <div className={styles.deliveryItems}>
                    {deliveryItems.length > 0 ? (
                        deliveryItems.map((deliveryItem) => (
                            <div key={deliveryItem._id} className={styles.deliveryItem}>
                                <p><strong>Item Name: </strong>{deliveryItem.item_name}</p>
                                <p><strong>Amount: &#8377;</strong>{deliveryItem.amount}</p>
                                <p><strong>Buyer Name: </strong>{deliveryItem.buyer_id}</p>
                                <input type="number" placeholder="Enter OTP" />
                                <button onClick={() => checkOTP(deliveryItem._id)}>Submit OTP</button>
                            </div>
                        ))
                    ) : (
                        <p>No items found</p>
                    )}
                </div>
                {statusMessage && (
                    <div 
                        style={{
                            marginTop: '20px',
                            color: statusMessageColor,
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}
                    >
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PendingDeliveries;