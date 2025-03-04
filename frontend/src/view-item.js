import React, { useState, useEffect } from 'react';
import styles from './view-item.module.css';
import './navbar.css';

function ViewItem() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [itemData, setItemData] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessageColor, setStatusMessageColor] = useState('');

    const fieldsToShow = ['name', 'price', 'description', 'category', 'seller'];

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
        const getItemData = async() => {
            const token = localStorage.getItem('token');
            const pathname = window.location.pathname;
            const itemId = pathname.split('/').pop().split('.')[0];
            if(!token) {
                window.location.href = '/login.html';
                return;
            }
            try {
                const response = await fetch('http://localhost:5001/api/item-operations/get-item-by-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }, 
                    body: JSON.stringify({ itemId: itemId }),
                });

                if(response.ok) {
                    const data = await response.json();
                    setItemData(data.item);
                } 
                else {
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                }
            }
            catch(error) {
                console.error('Error fetching item data:', error);
                localStorage.removeItem('token');
            }
            finally {
                setLoading(false);
            }
        }
        fetchUserData();
        getItemData();
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
        catch(error) {

        }
    };

    if(loading) {
        return <div>Loading...</div>;
    }

    const addToCart = async() => {
        try {
            const response = await fetch('http://localhost:5001/api/cart-operations/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ itemId: itemData._id }),
            });
            if(response.ok) {
                setStatusMessage('Item added to cart successfully');
                setStatusMessageColor('green');
            }
            else {
                setStatusMessage('Error adding item to cart');
                setStatusMessageColor('red');
            }
        }
        catch(error) {
            console.error('Error adding item to cart:', error);
            setStatusMessage('Error adding item to cart');
            setStatusMessageColor('red');
        }
    }

    return (
        <div className={styles.root}>
            <div className="navbar">
                <div className="navbar-left">
                    <a href="../profile.html">Profile</a>
                    <a href="../sell-item.html">Sell</a>
                    <a href="../pending-deliveries.html">Pending Deliveries</a>
                    <a href="../catalogue.html">Catalogue</a>
                    <a href="../history.html">Order history</a>
                    <a href="../cart.html">Cart</a>
                    <a href="../support.html">Chatbot Support</a>
                </div>
                <div className="navbar-right">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div className={styles.container}>
                <h1>View Item</h1>
                {fieldsToShow.map((field) => (
                    <div key={field} className={styles.field}>
                        <label className={styles.label}>{field[0].toUpperCase() + field.slice(1)}:</label>
                        <div className={styles.value}>
                            <span>
                                {itemData ? itemData[field] : ''}
                            </span>
                        </div>
                    </div>
                ))}
                <button 
                    className={styles.addToCartButton} 
                    disabled={user && itemData && user.email === itemData.seller}
                    style={{ 
                        backgroundColor: user && itemData && user.email === itemData.seller ? 'grey' : '#007bff',
                        borderColor: user && itemData && user.email === itemData.seller ? 'grey' : '#007bff',
                    }}
                    onClick={() => {
                        if (user && itemData && user.email !== itemData.seller) {
                            addToCart();
                        }
                    }}
                >  
                    Add to cart
                </button>
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

export default ViewItem;