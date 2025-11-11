'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#ff5252',
  };

  if (user) {
    return (
      <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: '10px', fontSize: '2.5rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>Welcome, {user.email}</h1>
        <p style={{ marginBottom: '30px', fontSize: '1.2rem' }}>You are signed in.</p>
        <Link href="/profile">
        <button
          style={{ ...buttonStyle, marginBottom: '10px' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
        >
          Profile
        </button>
        </Link>
        <button
        onClick={handleSignOut}
        style={buttonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
        >
        Sign Out
        </button>
      </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: '10px', fontSize: '2.5rem' }}>Welcome to the App</h1>
        <p style={{ marginBottom: '30px', fontSize: '1.2rem' }}>Please sign in or sign up to continue.</p>
        <Link href="/auth">
          <button
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#52ff86ff'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
          >
            Click here to Sign in 
          </button>
        </Link>
      </div>
    </div>
  );
}
