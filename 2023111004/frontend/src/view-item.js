import React, { useState, useEffect } from 'react';
import styles from './view-item.module.css';
import './navbar.css';

function ViewItem() {
    const [loading, setLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const fieldsToShow = ['name', 'price', 'description', 'category', 'seller'];

    useEffect(() => {
        const getItemData = async() => {
            const token = localStorage.getItem('token');
            const pathname = window.location.pathname;
            const itemId = pathname.split('/').pop().split('.')[0];
            console.log('Item ID:', itemId);
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
                    console.log('Item data:', data.item);
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
                                {itemData[field]}
                            </span>
                        </div>
                    </div>
                ))}
                <button className={styles.addToCartButton}>Add to cart</button>
            </div>
        </div>
    )
}

export default ViewItem;