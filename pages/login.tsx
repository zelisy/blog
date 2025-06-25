import React, { useState } from 'react';
import { useRouter } from 'next/router';

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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fcb69f 0%, #a1c4fd 100%)' }}>
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '2.5rem 2rem', maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, fontSize: 28, color: '#f76b1c', letterSpacing: 1 }}>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 16, padding: '12px', borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
          <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 16, padding: '12px', borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 8, background: 'linear-gradient(90deg, #fcb69f 0%, #a1c4fd 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(252,182,159,0.2)' }}>Giriş Yap</button>
        </form>
        {error && <div style={{ color: '#e74c3c', marginTop: 16, textAlign: 'center', fontWeight: 600 }}>{error}</div>}
      </div>
    </div>
  );
};

export default Login; 