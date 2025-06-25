import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = ({ login }: { login: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const user = await res.json();
      login(user);
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message || 'Giriş başarısız');
    }
  };

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#fafafa',
      padding: '2rem'
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
        padding: '2.5rem', 
        maxWidth: 400, 
        width: '100%',
        position: 'relative'
      }}>
        {/* Çarpı Butonu */}
        <Link href="/" style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: '#e74c3c',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: 'none'
        }}>
          ×
        </Link>

        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          fontWeight: 700, 
          fontSize: '2rem', 
          color: '#2c3e50'
        }}>
          Giriş Yap
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600, 
              color: '#333'
            }}>
              E-posta
            </label>
            <input 
              type="email" 
              placeholder="E-posta adresinizi girin" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '6px', 
                border: '2px solid #ddd', 
                fontSize: '16px',
                color: '#333',
                backgroundColor: '#fff'
              }} 
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600, 
              color: '#333'
            }}>
              Şifre
            </label>
            <input 
              type="password" 
              placeholder="Şifrenizi girin" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '6px', 
                border: '2px solid #ddd', 
                fontSize: '16px',
                color: '#333',
                backgroundColor: '#fff'
              }} 
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '6px', 
              background: '#3498db', 
              color: '#fff', 
              fontWeight: 600, 
              fontSize: '16px', 
              border: 'none', 
              cursor: 'pointer'
            }}
          >
            Giriş Yap
          </button>
        </form>
        
        {error && (
          <div style={{ 
            color: '#e74c3c', 
            marginTop: '1rem', 
            textAlign: 'center', 
            fontWeight: 600,
            padding: '0.5rem',
            backgroundColor: '#ffe6e6',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          color: '#666'
        }}>
          Hesabınız yok mu?{' '}
          <Link href="/register" style={{ 
            color: '#3498db', 
            textDecoration: 'none',
            fontWeight: 600
          }}>
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 