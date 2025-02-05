import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from './support.module.css';
import './navbar.css';

function Support() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [genAI, setGenAI] = useState(null);

    useEffect(() => {
        const initializeGemini = async () => {
            const generativeAI = new GoogleGenerativeAI('AIzaSyAG5ahVneL3QTP_lBbnc1u61d_EVmjXWT4');
            setGenAI(generativeAI);
        };

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

        initializeGemini();
        fetchUserData();
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || !genAI) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(input);
            const botReply = result.response.text();

            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        } catch (error) {
            console.error('Error in AI communication:', error);
            setMessages(prev => [...prev, { 
                sender: 'bot', 
                text: 'Sorry, I encountered an error processing your request.' 
            }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleLogout = async () => {
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

    if (loading) return <div>Loading...</div>;

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
            
            <div className={styles.chatContainer}>
                <div className={styles.messageList}>
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className={styles.inputArea}>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Support;