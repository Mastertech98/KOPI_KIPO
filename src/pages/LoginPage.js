import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Login gagal: username atau password salah');
        }
        
        return res.json();
      })
      .then(data => {
        // Misal data berupa user info/token
        localStorage.setItem('token', data.token);
        onLogin(data);
        navigate('/');
      })
      .catch(err => setError(err.message));
    }

  return (
    <div className="custom-form-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input 
          id="username" 
          type="text" 
          placeholder="Masukkan username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />

        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          type="password" 
          placeholder="Masukkan password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <p>Don't have an account?
          <a href='/register'>Register</a>
        </p>
        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>

  );
}

export default LoginPage;
