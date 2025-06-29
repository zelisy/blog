import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Blog yüklenirken hata:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem', color: '#333', textAlign: 'center' }}>
          Blog Yazılarımız
        </h1>
        
        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', padding: '4rem 0' }}>
            Henüz blog yazısı bulunmuyor.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {blogs.map(blog => (
              <div key={blog.id} style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}>
                {/* Blog Görseli */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={blog.imageUrl || '/gezi.avif'} 
                    alt={blog.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/gezi.avif';
                    }}
                  />
                </div>
                
                {/* Blog İçeriği */}
                <div style={{ padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#333', lineHeight: '1.4' }}>
                    {blog.title}
                  </h2>
                  <p style={{ margin: '0 0 1.5rem 0', color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>
                    {blog.content.slice(0, 200)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <Link href={`/blog/${blog.id}`} style={{ 
                      color: '#3498db', 
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: '1rem',
                      display: 'inline-block',
                      padding: '0.5rem 0',
                      borderBottom: '2px solid transparent',
                      transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderBottomColor = '#3498db';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderBottomColor = 'transparent';
                    }}>
                      Devamını Oku →
                    </Link>
                    <span style={{ color: '#999', fontSize: '0.9rem' }}>
                      {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 