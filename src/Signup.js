import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

 function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

 const handleSignup = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        password_confirmation: confirmPassword,
      }),
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);

      if (response.ok) {
        alert('Signup successful!');
        navigate('/home');
      } else {
        alert(data.error || Object.values(data)[0] || 'Signup failed.');
      }
    } catch (e) {
      console.error('Unexpected server response:', text);
      alert('Unexpected server error.');
    }
  } catch (error) {
    console.error('Signup request failed:', error);
    alert('Network error. Please try again.');
  }
};



  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <input
          type="text"
          className='Username'
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          className='Email'
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          id="ps"
          className='Password'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
        className='Confirm-Password'
          id="ps1"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p className="login-text">
          Already have an account?{' '}
          <Link className="login-link" to="/">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
