'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    try {
      // Check if user signed up with Google (no password)
      if (user.providerData.some(provider => provider.providerId === 'google.com')) {
        // For Google users, send password reset email to set a password
        await sendPasswordResetEmail(auth, user.email);
        setSuccess('Since you signed in with Google, we\'ve sent a password reset email to your address. Use it to set a password, then you can change it here.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '15px',
    textDecoration: 'underline',
  };

  if (!user) {
    return <div style={containerStyle}>Loading...</div>;
  }

  const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>Profile</h2>
        <p style={{ marginBottom: '20px' }}>Email: {user.email}</p>
        <p style={{ marginBottom: '20px' }}>Email Verified: <span style={{ color: user.emailVerified ? '#52ff86' : '#ff6b6b' }}>{user.emailVerified ? 'Yes' : 'No'}</span></p>
        <p style={{ marginBottom: '20px' }}>Sign-in Method: {isGoogleUser ? 'Google' : 'Email/Password'}</p>

        <h3 style={{ marginBottom: '20px' }}>Change Password</h3>
        {isGoogleUser ? (
          <p style={{ marginBottom: '20px', fontSize: '14px' }}>
            You signed in with Google. To set a password, click "Send Password Reset Email" below.
          </p>
        ) : (
          <form onSubmit={handlePasswordChange}>
            <div>
              <label style={labelStyle}>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={inputStyle}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label style={labelStyle}>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={inputStyle}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
                placeholder="Confirm new password"
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
              Update Password
            </button>
          </form>
        )}

        {isGoogleUser && (
          <button
            onClick={() => handlePasswordChange({ preventDefault: () => {} })}
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
          >
            Send Password Reset Email
          </button>
        )}

        <br />
        <Link href="/">
          <button style={linkButtonStyle}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
