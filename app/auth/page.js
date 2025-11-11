'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setSuccess('Account created! Please check your email to verify your account.');
        setTimeout(() => router.push('/'), 3000);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    setIsForgotPassword(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #bc5fefff 0%, #764ba2 100%)',
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
    maxWidth: '400px',
    width: '100%',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '5px',
    marginBottom: '15px',
    border: 'none',
    borderRadius: '25px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    textAlign: 'left',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  };

  const googleButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4285f4',
    marginTop: '15px',
  };

  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#411ef2ff',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '15px',
    textDecoration: 'underline',
  };

  if (isForgotPassword) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>Reset Password</h2>
          <form onSubmit={handleResetPassword}>
            <div>
              <label style={labelStyle}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                placeholder="Enter your email"
              />
            </div>
            {error && <p style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</p>}
            {success && <p style={{ color: '#4CAF50', marginBottom: '15px' }}>{success}</p>}
            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
              Reset Password
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            style={googleButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3367d6'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
          >
            Sign in with Google
          </button>
          <button
            onClick={() => setIsForgotPassword(false)}
            style={toggleButtonStyle}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="Enter your password"
            />
          </div>
          {error && <p style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</p>}
          {success && <p style={{ color: '#4CAF50', marginBottom: '15px' }}>{success}</p>}
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          style={googleButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#3367d6'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
        >
          Sign in with Google
        </button>
        {!isSignUp && (
          <button
            onClick={handleForgotPassword}
            style={toggleButtonStyle}
          >
            Forgot Password?
          </button>
        )}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={toggleButtonStyle}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
        <br />
        <Link href="/">
          <button
            style={{ ...toggleButtonStyle,color: '#f21e3eff', marginTop: '10px' }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
