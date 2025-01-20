import React, { useState, useEffect } from 'react';
import './profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login.html'; // Redirect to login if no token
        return;
      }

      try {
        // Get user details from backend using the logged-in user's email
        const response = await fetch('http://localhost:5001/api/user-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User Data:', data);
          setUser(data.user); // Store the user data
        } else {
          localStorage.removeItem('token');
          window.location.href = '/login.html';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []); // Run once on component mount

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  return (
    <div className="root">
      <div className="container">
        {user ? (
          <div>
            <h1>Hello, {user.email}!</h1>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Age: {user.age}</p>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
