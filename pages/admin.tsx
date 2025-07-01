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
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

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

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#ffffff',
      padding: '20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Yükleniyor...</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>
        ) : (
          activeTab === 'blogs' ? (
            <div>
              {blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  Onay bekleyen blog bulunmuyor.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {blogs.map(blog => (
                    <div key={blog.id} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      background: '#f8f9fa'
                    }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{blog.title}</h3>
                      <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                        {blog.content.slice(0, 200)}...
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApprove(blog.id)}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => handleReject(blog.id)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Reddet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  Henüz yorum bulunmuyor.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {comments.map(comment => (
                    <div key={comment.id} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      background: comment.isApproved ? '#f8f9fa' : '#fff3cd'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <strong style={{ color: '#333' }}>{comment.authorName}</strong>
                          <span style={{ color: '#666', marginLeft: '0.5rem' }}>({comment.authorEmail})</span>
                        </div>
                        <span style={{
                          background: comment.isApproved ? '#28a745' : '#ffc107',
                          color: comment.isApproved ? 'white' : '#333',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {comment.isApproved ? 'Onaylı' : 'Onay Bekliyor'}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                        <strong>Blog:</strong> {comment.blog.title}
                      </p>
                      <p style={{ margin: '0 0 1rem 0', color: '#666', lineHeight: '1.6' }}>
                        {comment.content}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!comment.isApproved && (
                          <button
                            onClick={() => handleCommentApprove(comment.id, true)}
                            style={{
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Onayla
                          </button>
                        )}
                        {comment.isApproved && (
                          <button
                            onClick={() => handleCommentApprove(comment.id, false)}
                            style={{
                              background: '#ffc107',
                              color: '#333',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Onayı Kaldır
                          </button>
                        )}
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
