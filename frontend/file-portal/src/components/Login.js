import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    console.log(email,password)

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        "email":email,
        "password":password,
      });

      // Assuming the server returns a success message
      if (response.data.message === 'Login successful') {
        // Redirect or perform actions after successful login
        window.location.replace("/upload")
        const token = response.data.token;
        console.log(token)
        localStorage.setItem('token', token);
        localStorage.setItem('userDetails', JSON.stringify(response.data.userDetails));
        console.log(response.data.userDetails)
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div className='login-container'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className='login-form' onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
}

export default Login;
