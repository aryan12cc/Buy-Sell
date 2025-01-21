import React, { useState, useEffect } from 'react';
import styles from './profile.module.css';
import './navbar.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessageColor, setStatusMessageColor] = useState(''); // for green or red messages

    const fieldLabels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        age: 'Age',
        contact: 'Contact',
    };

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

    const handleLogout = () => {
        setStatusMessage('');
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    };

    const handleEditToggle = () => {
        setStatusMessage('');
        setEditing((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('user:', user);
            const response = await fetch('http://localhost:5001/api/user-details/update-user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            if(response.ok) {
                const newUserDetails = await response.json();
                setUser(newUserDetails.user);
                setEditing(false);
                setStatusMessage('Profile updated successfully!');
                setStatusMessageColor('green');
            } 
            else {
                const oldUserDetails = await response.json();
                console.log('oldUserDetails:', oldUserDetails);
                setStatusMessage('Error updating profile');
                setStatusMessageColor('red');
                setUser(oldUserDetails.user);
                if(response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                } 
                else {
                    setEditing(false);
                }
            }
        } 
        catch (error) {
            console.error('Error saving user data:', error);
            setStatusMessage('Error saving user data');
            setStatusMessageColor('red');
            setEditing(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const displayedFields = ['firstName', 'lastName', 'email', 'age', 'contact'];

    return (
        <div className={styles.root}>
            <div className="navbar">
                <div className="navbar-left">
                    <a href="">Home</a>
                    <a href="">About</a>
                    <a href="">Contact</a>
                </div>
                <div className="navbar-right">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className={styles.container}>
                <h1>Profile Details</h1>
                {displayedFields.map((key) => (
                    <div className={styles.profileField} key={key}>
                        <label>{fieldLabels[key]}: </label>
                        {editing && key !== 'email' ? (
                            <input
                                type="text"
                                name={key}
                                value={user[key] || ''}
                                onChange={handleInputChange}
                                className={styles.editableInput}
                            />
                        ) : (
                            <span>{user[key]}</span>
                        )}
                    </div>
                ))}
                {editing ? (
                    <button className={styles.saveButton} onClick={handleSave}>
                        Save
                    </button>
                ) : (
                    <button className={styles.saveButton} onClick={handleEditToggle}>
                        Edit Profile
                    </button>
                )}
                
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

export default Profile;
