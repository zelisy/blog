import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Create = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Bir hata oluştu');
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2>Yeni Blog Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>Başlık</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: 4,
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff'
            }}
            placeholder="Blog başlığını girin..."
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>İçerik</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={8}
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: 4,
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              resize: 'vertical'
            }}
            placeholder="Blog içeriğini girin..."
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 16, padding: '8px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ 
          padding: '12px 24px',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Oluşturuluyor...' : 'Oluştur'}
        </button>
      </form>
    </div>
  );
};

export default Create; 