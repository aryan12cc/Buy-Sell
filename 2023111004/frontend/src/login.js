import React, { useState, useEffect } from 'react';
import './login.css';

function Login() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const [formFields, setFormFields] = useState({
    register: [
      { name: 'firstName', type: 'text', value: '', placeholder: 'Aryan', fieldName: 'First Name' },
      { name: 'lastName', type: 'text', value: '', placeholder: 'Maskara', fieldName: 'Last Name' },
      { name: 'email', type: 'email', value: '', placeholder: 'aryan.maskara@research.iiit.ac.in', fieldName: 'Email' },
      { name: 'age', type: 'number', value: '', placeholder: '19', fieldName: 'Age' },
      { name: 'contact', type: 'number', value: '', placeholder: '9876543210', fieldName: 'Contact' },
      { name: 'password', type: 'password', value: '', placeholder: 'password', fieldName: 'Password' },
      { name: 'confirmPassword', type: 'password', value: '', placeholder: 'password', fieldName: 'Confirm Password' },
    ],
    login: [
      { name: 'email', type: 'email', value: '', placeholder: 'aryan.maskara@research.iiit.ac.in', fieldName: 'Email' },
      { name: 'password', type: 'password', value: '', placeholder: 'password', fieldName: 'Password' },
    ],
  });

  const handleInputChange = (formType, index, value) => {
    const updatedFields = [...formFields[formType]];
    updatedFields[index].value = value;
    setFormFields({ ...formFields, [formType]: updatedFields });
    setMessage('');
    setMessageColor('');
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setMessage('');
    setMessageColor('');
    const resetFields = formFields[isRegistering ? 'register' : 'login'].map(field => ({
      ...field,
      value: ''
    }));
    setFormFields({
      ...formFields,
      [isRegistering ? 'register' : 'login']: resetFields,
    });
  };

  const handleSubmission = async(e) => {
    e.preventDefault();
    setMessage('');
    setMessageColor('');
    const formType = isRegistering ? 'register' : 'login';
    const apiEndpoint = isRegistering ? 'http://localhost:5001/api/submit-registration/register' : 'http://localhost:5001/api/submit-registration/login';
    const formValues = formFields[formType].reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if(response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setMessageColor('green');

        if(isRegistering) {
          console.log('register-data:', data);
          setIsRegistering(false);
          const resetFields = formFields.register.map(field => ({
            ...field,
            value: ''
          }));
          setFormFields({
            ...formFields,
            register: resetFields,
          });
        }
        else {
          console.log('login-data:', data);
          localStorage.setItem('token', data.token);
          window.location.href = '/profile.html';
        }
      } 
      else {
        const errorData = await response.json();
        setMessage(errorData.message);
        setMessageColor('red');
      }
    }
    catch(error) {
      setMessage('An error occurred. Please try again later.');
      setMessageColor('red');
    }

    const resetFields = formFields[formType].map(field => ({
      ...field,
      value: ''
    }));

    setFormFields({
      ...formFields,
      [formType]: resetFields,
    });
  }

  const renderFormFields = (fields, formType) => (
    fields.map((field, index) => (
      <div key={index}>
        <h4>{field.fieldName}</h4>
        <input
          type={field.type}
          id={`${formType}-${field.name}`}
          value={field.value}
          placeholder={field.placeholder}
          onChange={(e) => handleInputChange(formType, index, e.target.value)}
        />
      </div>
    ))
  );

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      console.log('token = ', token);
      try {
          const response = await fetch('http://localhost:5001/api/validate-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            // Token is valid, redirect to profile
            window.location.href = '/profile.html';
          } else {
            // Token is invalid, remove it from storage
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
        }
      };

    checkToken();
  }, []);

  return (
    <div className="root">
      <div className="container">
        {isRegistering ? (
          <form id="registerForm" onSubmit={handleSubmission}>
            <h2>Register</h2>
            {renderFormFields(formFields.register, 'register')}
            {message && (
              <p style={{ color: messageColor }}>
                {message}
              </p>
            )}
            <button id="submit-register" type="submit">Register</button>
          </form>
        ) : (
          <form id="loginForm" onSubmit={handleSubmission}>
            <h2>Login</h2>
            {renderFormFields(formFields.login, 'login')}
            {message && (
              <p style={{ color: messageColor }}>
                {message}
              </p>
            )}
            <button id="submit-login" type="submit">Login</button>
          </form>
        )}
      </div>
      <div id="switchButton" className="switch">
        <p>{isRegistering ? 'Already have an account?' : "Don't have an account?"}</p>
        <button onClick={toggleForm}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </div>
    </div>
  );
}

export default Login;
