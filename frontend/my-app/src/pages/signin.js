import { useRouter } from 'next/router';
import React, { useState } from 'react';

const signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:5000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    localStorage.setItem('accessToken', data.accessToken); // store token in local storage
    localStorage.setItem('refreshToken', data.refreshToken); // store token in local storage
    router.push('/protectedHome');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>signin</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default signin;
