import React, { useState, useEffect } from 'react';
import styles from './cart.module.css';
import './navbar.css';

function Cart() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalBill, setTotalBill] = useState(0);
    const [cartItems, setCartItems] = useState([]);
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

    const getCartItems = async() => {
        try {
            const response = await fetch('http://localhost:5001/api/cart-operations/view-cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if(response.ok) {
                const responseValue = await response.json();
                setCartItems(Array.isArray(responseValue.items) ? responseValue.items : []);
                let current = 0;
                for(let i = 0; i < responseValue.items.length; i++) {
                    current += responseValue.items[i].price;
                }
                setTotalBill(current);
            }
            else {
                console.error('Error fetching cart items');
            }
        }
        catch(error) {
            console.error('Error fetching cart items:', error);
        }
    };
    getCartItems();

    const deleteCartItem = async(itemId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/cart-operations/remove-item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if(response.ok) {
                getCartItems();
                setStatusMessage('Item removed from cart');
                setStatusMessageColor('green');
            }
            else {
                setStatusMessage('Error removing item from cart');
                setStatusMessageColor('red');
            }
        }
        catch(error) {

        }
    };

    function getRandomSixDigitNumber() {
        const number = Math.floor(Math.random() * 1000000);
        return number.toString().padStart(6, '0');
    }

    const deleteItem = async(itemId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/item-operations/delete-item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if(response.ok) {
                getCartItems();
            }
            else {

            }
        }
        catch(error) {

        }
    }

    const placeOrder = async() => {
        let count = [];
        for(let i = 0; i < cartItems.length; i++) {
            try {
                const response = await fetch('http://localhost:5001/api/order-operations/add-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        itemId: cartItems[i]._id,
                        sellerEmail: cartItems[i].seller,
                        amount: cartItems[i].price,
                        itemName: cartItems[i].name,
                    }),
                });
                if(response.ok) {
                    deleteItem(cartItems[i]._id);
                    count.push(i);
                }
                else {

                }
            }
            catch(error) {

            }
        }
        getCartItems();
    };

    if(loading) {
        return <div>Loading...</div>;
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

            <h1>My Cart</h1>
            <div className={styles.container}>
                {cartItems.map((item) => (
                    <div className={styles.item} key={item._id}>
                        <div className={styles.itemDetails}>
                            <div className={styles.leftSide}>
                                <h2>{item.name}</h2>
                                <p>Seller: {item.seller}</p>
                                <p>Description: {item.description}</p>
                                <p>Category: {item.category}</p>
                            </div>
                            <div className={styles.rightSide}>
                                <p>{item.price}</p>
                                <button className={styles.removeButton} onClick={() => deleteCartItem(item._id)}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className={styles.totalBill}>
                    <h2>Total Bill: &#8377;{totalBill}</h2>
                </div>
                <div className={styles.finalOrder}>
                    <button className={styles.finalOrderButton} onClick={() => placeOrder()}>Place Order</button>
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
    );
}

export default Cart;