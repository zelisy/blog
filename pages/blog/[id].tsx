import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: {
    name: string;
  };
  views: number;
}

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchComments();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Blog yüklenirken hata:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?blogId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...commentForm,
          blogId: id,
        }),
      });

      if (response.ok) {
        setCommentForm({ authorName: '', authorEmail: '', content: '' });
        fetchComments();
        alert('Yorumunuz başarıyla eklendi!');
      } else {
        alert('Yorum eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Yorum gönderilirken hata:', error);
      alert('Yorum gönderilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Yükleniyor...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Blog bulunamadı.</div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', padding: '2rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Geri Dön Butonu */}
        <Link href="/blog" style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#3498db',
          textDecoration: 'none',
          marginBottom: '2rem',
          fontWeight: 600,
          fontSize: '1rem'
        }}>
          ← Blog Listesine Dön
        </Link>

        {/* Blog İçeriği */}
        <article style={{ 
          background: '#fff', 
          borderRadius: '12px', 
          padding: '3rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: '1rem', 
            color: '#333', 
            lineHeight: '1.3' 
          }}>
            {blog.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '2rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <span>Yazar: {blog.author.name}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
            <span>•</span>
            <span>{blog.views} görüntülenme</span>
          </div>

          {/* Blog Görseli */}
          {blog.imageUrl && (
            <div style={{
              width: '100%',
              height: '400px',
              overflow: 'hidden',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <img 
                src={blog.imageUrl} 
                alt={blog.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div style={{ 
            lineHeight: '1.8', 
            fontSize: '1.1rem', 
            color: '#444',
            whiteSpace: 'pre-wrap'
          }}>
            {blog.content}
          </div>
        </article>

        {/* Yorumlar Bölümü */}
        <section style={{ 
          background: '#fff', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 600, 
            marginBottom: '2rem', 
            color: '#333' 
          }}>
            Yorumlar ({comments.length})
          </h2>

          {/* Yorum Formu */}
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#333' }}>
              Yorum Yap
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Adınız"
                  value={commentForm.authorName}
                  onChange={(e) => setCommentForm({...commentForm, authorName: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={commentForm.authorEmail}
                  onChange={(e) => setCommentForm({...commentForm, authorEmail: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <textarea
                placeholder="Yorumunuzu yazın..."
                value={commentForm.content}
                onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                required
                rows={4}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#3498db',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
            </button>
          </form>

          {/* Yorumlar Listesi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} style={{
                  padding: '1.5rem',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <strong style={{ color: '#333' }}>{comment.authorName}</strong>
                    <span style={{ color: '#999', fontSize: '0.9rem' }}>
                      {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p style={{ 
                    color: '#444', 
                    lineHeight: '1.6', 
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
} 