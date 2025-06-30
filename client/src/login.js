
    import React, { useState } from 'react';
import './App.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (username && password) {
      onLogin(username);
      localStorage.setItem('user', username);
    }
  };

  return (
    <div className="login-container">
      <h2>✨ Welcome to Task Organizer</h2>
      <p className="login-subtitle">Log in with any username and password to start organizing your tasks!</p>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          type="button"
          className="toggle-button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button onClick={handleLogin} className="login-button">Login</button>
    </div>
  );
}
