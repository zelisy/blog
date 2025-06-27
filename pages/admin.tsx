import React, { useEffect, useState } from 'react';

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author?: { name: string };
}

export default function AdminPanel() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = () => {
    setLoading(true);
    fetch('/api/blogs?all=1')
      .then(r => r.json())
      .then(data => {
        setBlogs(data.filter((b: Blog) => b.isApproved === false));
        setLoading(false);
      })
      .catch(() => {
        setError('Bloglar yüklenemedi');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleApprove = async (id: number) => {
    await fetch('/api/blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isApproved: true })
    });
    fetchBlogs();
  };

  const handleReject = async (id: number) => {
    await fetch('/api/blogs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchBlogs();
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#1a237e', fontWeight: 800, letterSpacing: 1 }}>Onay Bekleyen Bloglar</h2>
      {blogs.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#b71c1c', fontWeight: 600 }}>Onay bekleyen blog yok.</div>
      ) : (
        blogs.map(blog => (
          <div key={blog.id} style={{ borderBottom: '1px solid #eee', marginBottom: 24, paddingBottom: 16 }}>
            <h3 style={{ marginBottom: 8, color: '#1565c0', fontWeight: 700 }}>{blog.title}</h3>
            <div style={{ color: '#388e3c', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Yazar: <span style={{ color: '#1b5e20' }}>{blog.author?.name || 'Bilinmiyor'}</span> | <span style={{ color: '#6d4c41' }}>Tarih: {new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span></div>
            <div style={{ marginBottom: 12, color: '#263238', fontWeight: 500 }}>{blog.content.slice(0, 200)}...</div>
            <button onClick={() => handleApprove(blog.id)} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, marginRight: 12, cursor: 'pointer' }}>Onayla</button>
            <button onClick={() => handleReject(blog.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Reddet</button>
          </div>
        ))
      )}
    </div>
  );
} 