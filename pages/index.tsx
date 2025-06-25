import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <main style={{ minHeight: '100vh', background: '#fff', padding: '2rem 0' }}>
      <h1 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#f76b1c' }}>
        Zeliş'in Blog Sitesine Hoşgeldiniz!
      </h1>
      <section style={{ margin: '2rem 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Öne Çıkan Bloglar</h2>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 16, paddingBottom: 8 }}>
          {featured.length === 0 && <div>Öne çıkan blog yok.</div>}
          {featured.map(blog => (
            <div key={blog.id} style={{ minWidth: 300, background: '#fcb69f', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{blog.title}</h3>
              <p style={{ margin: '12px 0', color: '#333' }}>{blog.content.slice(0, 80)}...</p>
              <Link href={`/blog/${blog.id}`} style={{ color: '#2193b0', fontWeight: 600 }}>Devamını Oku</Link>
            </div>
          ))}
        </div>
      </section>
      <section style={{ margin: '2rem 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Tüm Bloglar</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {all.length === 0 && <div>Blog bulunamadı.</div>}
          {all.map(blog => (
            <div key={blog.id} style={{ flex: '1 1 300px', minWidth: 300, background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{blog.title}</h3>
              <p style={{ margin: '12px 0', color: '#333' }}>{blog.content.slice(0, 120)}...</p>
              <Link href={`/blog/${blog.id}`} style={{ color: '#f76b1c', fontWeight: 600 }}>Devamını Oku</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
