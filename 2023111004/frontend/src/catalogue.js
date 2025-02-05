import React, { useState, useEffect } from 'react';
import styles from './catalogue.module.css';
import './navbar.css';

function Catalogue() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessageColor, setStatusMessageColor] = useState('');
    const [items, setItems] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sellerFilter, setSellerFilter] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    const categoryList = ['Electronics', 'Clothing', 'Books', 'Food', 'General'];

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

        const getItems = async() => {
            try {
                const response = await fetch('http://localhost:5001/api/item-operations/get-items',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({searchTerm: '', selectedCategories: selectedCategories, sellerFilter: sellerFilter, priceRange: priceRange}),
                });
                if(response.ok) {
                    const data = await response.json();
                    setItems(data.items);
                }
                else {
                    setStatusMessage('Error submitting item');
                    setStatusMessageColor('red');
                    if(response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.href = '/login.html';
                    }
                }
            }
            catch(error) {
                console.error('Error fetching items:', error);
                setStatusMessage('Error fetching items');
                setStatusMessageColor('red');
            }
        };

        fetchUserData();
        getItems();
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

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category];

            console.log('selectedCategories:', newCategories);
            console.log('category:', category);

            return newCategories;
        });
    };

    const searchItems = async() => {
        const searchInput = document.querySelector(`.${styles.searchBar} input`);
        
        const getItems = async() => {
            try {
                const response = await fetch('http://localhost:5001/api/item-operations/get-items',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({searchTerm: searchInput.value, selectedCategories: selectedCategories, sellerFilter: sellerFilter, priceRange: priceRange}),
                });
                if(response.ok) {
                    const data = await response.json();
                    searchInput.value = '';
                    setItems(data.items);
                }
                else {
                    setStatusMessage('Error submitting item');
                    setStatusMessageColor('red');
                    if(response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.href = '/login.html';
                    }
                }
            }
            catch(error) {
                console.error('Error fetching items:', error);
                setStatusMessage('Error fetching items');
                setStatusMessageColor('red');
            }
        };
        getItems();
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

            <div className={styles.container}>
                <div className={styles.filtersSidebar}>
                    <h3>Filters</h3>
                    <div className={styles.filterSection}>
                        <h4>Categories</h4>
                        {categoryList.map(category => (
                            <div key={category} className={styles.filterRow}>
                                <div key={category} className={styles.filterCheckbox}>
                                    <input 
                                        type="checkbox" 
                                        id={category} 
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                    />
                                </div>
                                <label htmlFor={category}>{category}</label>
                            </div>
                        ))}
                    </div>
                    <div className={styles.filterSection}>
                        <h4>Seller</h4>
                        <input 
                            type="text" 
                            placeholder="Email"
                            value={sellerFilter}
                            onChange={(e) => setSellerFilter(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterSection}>
                        <h4>Price Range</h4>
                        <div className={styles.priceInputs}>
                            <input 
                                type="number" 
                                placeholder="Min Price"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
                            />
                            <input 
                                type="number" 
                                placeholder="Max Price"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.catalogue}>
                    <h1>Catalogue</h1>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Search for items" />
                        <button onClick={searchItems}>Search</button>
                    </div>
                    <div className={styles.items}>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <a href={`view-item/${item._id}.html`} className={styles.item} key={item._id}>
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p><strong>Price:</strong> ₹{item.price}</p>
                                    <p><strong>Category:</strong> {item.category}</p>
                                    <p><strong>Seller:</strong> {item.seller}</p>
                                </a>
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
        </div>
    )
}

export default Catalogue;