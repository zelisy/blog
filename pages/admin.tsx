import React, { useEffect, useState } from 'react';

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  author?: { name: string };
}

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  isApproved: boolean;
  blog: {
    title: string;
  };
}

export default function AdminPanel() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'blogs' | 'comments'>('blogs');

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

  const fetchComments = () => {
    setLoading(true);
    fetch('/api/admin/comments')
      .then(r => r.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Yorumlar yüklenemedi');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'comments') {
      fetchComments();
    }
  }, [activeTab]);

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

  const handleCommentApprove = async (id: number, isApproved: boolean) => {
    await fetch('/api/admin/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isApproved })
    });
    fetchComments();
  };

  const handleCommentDelete = async (id: number) => {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE',
      });
      fetchComments();
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#ffffff',
      padding: '20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          marginBottom: 32, 
          borderBottom: '2px solid #f0f0f0',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveTab('blogs')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'blogs' ? '#667eea' : 'transparent',
              color: activeTab === 'blogs' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Onay Bekleyen Bloglar ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'comments' ? '#667eea' : 'transparent',
              color: activeTab === 'comments' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Yorumlar ({comments.length})
          </button>
        </div>

        {activeTab === 'blogs' ? (
          <>
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
          </>
        ) : (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#1a237e', fontWeight: 800, letterSpacing: 1 }}>Yorum Yönetimi</h2>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#b71c1c', fontWeight: 600 }}>Henüz yorum yok.</div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} style={{ 
                  borderBottom: '1px solid #eee', 
                  marginBottom: 24, 
                  paddingBottom: 16,
                  background: comment.isApproved ? '#f8f9fa' : '#fff3cd',
                  padding: '16px',
                  borderRadius: '8px',
                  border: comment.isApproved ? '1px solid #e9ecef' : '1px solid #ffeaa7'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ margin: 0, color: '#1565c0', fontWeight: 700 }}>Blog: {comment.blog.title}</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {comment.isApproved ? (
                        <button 
                          onClick={() => handleCommentApprove(comment.id, false)}
                          style={{ 
                            background: '#ffc107', 
                            color: '#000', 
                            border: 'none', 
                            borderRadius: 6, 
                            padding: '6px 12px', 
                            fontWeight: 600, 
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Onayı Kaldır
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCommentApprove(comment.id, true)}
                          style={{ 
                            background: '#28a745', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            padding: '6px 12px', 
                            fontWeight: 600, 
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Onayla
                        </button>
                      )}
                      <button 
                        onClick={() => handleCommentDelete(comment.id)}
                        style={{ 
                          background: '#dc3545', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 6, 
                          padding: '6px 12px', 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  <div style={{ color: '#388e3c', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                    Yazar: <span style={{ color: '#1b5e20' }}>{comment.authorName}</span> | 
                    E-posta: <span style={{ color: '#1b5e20' }}>{comment.authorEmail}</span> | 
                    Tarih: <span style={{ color: '#6d4c41' }}>{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div style={{ 
                    marginBottom: 12, 
                    color: '#263238', 
                    fontWeight: 500,
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {comment.content}
                  </div>
                  
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: comment.isApproved ? '#6c757d' : '#ffc107',
                    fontWeight: 600
                  }}>
                    {comment.isApproved ? '✓ Onaylandı' : '● Onay Bekliyor'}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
} 