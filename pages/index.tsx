import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: number;
  title: string;
  content: string;
  featured: boolean;
}

export default function Home() {
  const [featured, setFeatured] = useState<Blog[]>([]);
  const [all, setAll] = useState<Blog[]>([]);

  useEffect(() => {
    fetch('/api/blogs?featured=1').then(r => r.json()).then(setFeatured);
    fetch('/api/blogs').then(r => r.json()).then(setAll);
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', padding: '2rem 0' }}>
      {/* Hoşgeldiniz Yazısı */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        fontWeight: 700, 
        marginBottom: '2rem', 
        color: '#fff',
        background: '#34495e',
        padding: '1rem',
        borderRadius: '8px',
        margin: '0 2rem 2rem 2rem'
      }}>
        Hoşgeldiniz
      </div>

      {/* Gezi Resmi */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '0 2rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <img 
            src="/gezi.avif" 
            alt="Gezi" 
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      </div>

      {/* Blog Bölümü */}
      <section style={{ margin: '2rem', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 600, 
          marginBottom: '2rem', 
          color: '#333',
          textAlign: 'center'
        }}>
          Blog Yazılarımız
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          padding: '0 1rem'
        }}>
          {all.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              gridColumn: '1 / -1',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              Henüz blog yazısı bulunmuyor.
            </div>
          )}
          
          {all.map(blog => (
            <div key={blog.id} style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              padding: '1.5rem',
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
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#333',
                lineHeight: '1.4'
              }}>
                {blog.title}
              </h3>
              <p style={{ 
                margin: '0 0 1rem 0', 
                color: '#666',
                lineHeight: '1.6',
                fontSize: '0.95rem'
              }}>
                {blog.content.slice(0, 150)}...
              </p>
              <Link href={`/blog/${blog.id}`} style={{ 
                color: '#3498db', 
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
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
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
