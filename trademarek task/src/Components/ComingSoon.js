import React from 'react';
import { Link } from 'react-router-dom';

export default function ComingSoon() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        Coming Soon
      </h1>
      <p style={{
        fontSize: '18px',
        marginBottom: '30px',
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        We're working hard to bring you this feature. Please check back later!
      </p>
      <Link to="/" style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
      }}>
        Return to Home
      </Link>
    </div>
  );
}