import React, { useState, useEffect } from 'react';
import styles from './history.module.css';
import './navbar.css';

function OrderHistory() {
    const [loading, setLoading] = useState(true);
    const [fetchedOrderHistory, setFetchedOrderHistory] = useState(0);
    const [activeTab, setActiveTab] = useState('pending');
    const [otp, setOtp] = useState('');
    const [pendingOrders, setPendingOrders] = useState([]);
    const [boughtOrders, setBoughtOrders] = useState([]);
    const [soldOrders, setSoldOrders] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessageColor, setStatusMessageColor] = useState('black');
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
                        await response.json();
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

    const fetchOrderHistory = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/order-operations/fetch-history', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if(response.ok) {
                const receivedValue = await response.json();
                setPendingOrders(receivedValue.pending);
                setBoughtOrders(receivedValue.bought);
                setSoldOrders(receivedValue.sold);
            }
        }
        catch(error) {

        }
    }
    if(!loading && fetchedOrderHistory === 0 && activeTab) {
        fetchOrderHistory();
        setFetchedOrderHistory(1);
    }

    if(loading) {
        return <p>Loading...</p>
    }

    const changeHashedOtp = async(orderId, otp) => {
        try {
            const response = await fetch('http://localhost:5001/api/order-operations/change-hashed-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ orderId, otp }),
            });
            if(response.ok) {
                const data = await response.json();
                setStatusMessage(data.message);
                setStatusMessageColor('green');
            }
            else {
                const error = await response.json();
                setStatusMessage(error.message);
                setStatusMessageColor('red');
            }
        }
        catch(error) {

        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'pending':
                return (
                    <div>
                        <h2>Pending Items</h2>
                        <div className={styles.pendingOrders}>
                            {pendingOrders.map((order) => (
                                <div key={order._id} className={styles.order}>
                                    <p>Item: {order.item_name}</p>
                                    <p>Buyer: {order.buyer_id}</p>
                                    <p>OTP: {(localStorage.getItem(`otp_${order._id}`)) ? localStorage.getItem(`otp_${order._id}`) : ''}</p>
                                    <button onClick={() => {
                                        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                                        localStorage.setItem(`otp_${order._id}`, newOtp);
                                        setOtp(newOtp);
                                        changeHashedOtp(order._id, newOtp);
                                    }}>Generate OTP</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'bought':
                return (
                    <div>
                        <h2> Bought Items </h2>
                        <div className={styles.boughtOrders}>
                            {boughtOrders.map((order) => (
                                <div key={order._id} className={styles.order}>
                                    <p>Item: {order.item_name}</p>
                                    <p>Seller: {order.seller_id}</p>
                                    <p>Price: {order.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'sold':
                return (
                    <div>
                        <h2> Sold Items </h2>
                        <div className={styles.soldOrders}>
                            {soldOrders.map((order) => (
                                <div key={order._id} className={styles.order}>
                                    <p>Item: {order.item_name}</p>
                                    <p>Buyer: {order.buyer_id}</p>
                                    <p>Price: {order.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

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

            <h1>Order History</h1>
            <div className={styles.tabs}>
                <button onClick={() => setActiveTab('pending')}>Pending</button>
                <button onClick={() => setActiveTab('bought')}>Bought</button>
                <button onClick={() => setActiveTab('sold')}>Sold</button>
            </div>
            <div className={styles.tabContent}>
                {renderTabContent()}
            </div>
        </div>
    );
}

export default OrderHistory;