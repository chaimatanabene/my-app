import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login button clicked");

    if (email && password) {
      console.log("Navigating to /home");
      navigate('/home');
    } else {
      alert("Email or password missing");
    }
  };

  return (
     

    <div className="login-container">
       

      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className="signup-text">
          Don't have an account?{' '}
          <Link className="signup-link" to="/signup">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
