import React, { useEffect, useState } from 'react';

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  author?: { name: string };
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  adminReply?: string;
  repliedAt?: string;
  repliedBy?: string;
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
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'blogs' | 'messages' | 'comments'>('blogs');
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

  const fetchMessages = () => {
    setLoading(true);
    fetch('/api/contact')
      .then(r => r.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Mesajlar yüklenemedi');
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
    } else if (activeTab === 'messages') {
      fetchMessages();
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

  const handleMarkAsRead = async (id: number, isRead: boolean) => {
    await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isRead })
    });
    fetchMessages();
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

  const handleReply = async (id: number) => {
    if (!replyText.trim()) {
      alert('Yanıt metni boş olamaz!');
      return;
    }

    console.log('Yanıt gönderiliyor:', {
      id,
      adminReply: replyText.trim(),
      repliedBy: 'Admin'
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          isRead: true, 
          adminReply: replyText.trim(),
          repliedBy: 'Admin'
        })
      });

      console.log('API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API response:', result);
        alert('Yanıt başarıyla gönderildi!');
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        alert('Yanıt gönderilemedi: ' + (errorData.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Yanıt gönderme hatası:', error);
      alert('Yanıt gönderilirken bir hata oluştu');
    }
    
    setReplyingTo(null);
    setReplyText('');
    fetchMessages();
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
          borderBottom: '2px solid #f0f0f0' 
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
            onClick={() => setActiveTab('messages')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'messages' ? '#667eea' : 'transparent',
              color: activeTab === 'messages' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              marginLeft: '8px'
            }}
          >
            İletişim Mesajları ({Array.isArray(messages) ? messages.filter(m => !m.isRead).length : 0} okunmamış)
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
              fontSize: '1rem',
              marginLeft: '8px'
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
        ) : activeTab === 'messages' ? (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#1a237e', fontWeight: 800, letterSpacing: 1 }}>İletişim Mesajları</h2>
            {!Array.isArray(messages) || messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#b71c1c', fontWeight: 600 }}>Henüz mesaj yok.</div>
            ) : (
              messages.map(message => (
                <div key={message.id} style={{ 
                  borderBottom: '1px solid #eee', 
                  marginBottom: 24, 
                  paddingBottom: 16,
                  background: message.isRead ? '#f8f9fa' : '#fff3cd',
                  padding: '16px',
                  borderRadius: '8px',
                  border: message.isRead ? '1px solid #e9ecef' : '1px solid #ffeaa7'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ margin: 0, color: '#1565c0', fontWeight: 700 }}>{message.subject}</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {!message.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(message.id, true)}
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
                          Okundu İşaretle
                        </button>
                      )}
                      {message.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(message.id, false)}
                          style={{ 
                            background: '#6c757d', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            padding: '6px 12px', 
                            fontWeight: 600, 
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Okunmadı İşaretle
                        </button>
                      )}
                      {!message.adminReply && (
                        <button 
                          onClick={() => setReplyingTo(message.id)}
                          style={{ 
                            background: '#007bff', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            padding: '6px 12px', 
                            fontWeight: 600, 
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Yanıtla
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ color: '#388e3c', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                    Gönderen: <span style={{ color: '#1b5e20' }}>{message.name}</span> | 
                    E-posta: <span style={{ color: '#1b5e20' }}>{message.email}</span> | 
                    Tarih: <span style={{ color: '#6d4c41' }}>{new Date(message.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div style={{ 
                    marginBottom: 12, 
                    color: '#263238', 
                    fontWeight: 500,
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {message.message}
                  </div>
                  
                  {/* Admin Yanıtı */}
                  {message.adminReply && (
                    <div style={{ 
                      marginTop: 16, 
                      padding: 12, 
                      background: '#e3f2fd', 
                      borderRadius: 6,
                      border: '1px solid #bbdefb'
                    }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 600, 
                        color: '#1976d2',
                        marginBottom: 8
                      }}>
                        Admin Yanıtı ({message.repliedBy}) - {message.repliedAt && new Date(message.repliedAt).toLocaleDateString('tr-TR')}
                      </div>
                      <div style={{ 
                        color: '#1565c0', 
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {message.adminReply}
                      </div>
                    </div>
                  )}

                  {/* Yanıt Verme Formu */}
                  {replyingTo === message.id && (
                    <div style={{ 
                      marginTop: 16, 
                      padding: 12, 
                      background: '#fff3cd', 
                      borderRadius: 6,
                      border: '1px solid #ffeaa7'
                    }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Yanıtınızı yazın..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: 4,
                          fontSize: '0.9rem',
                          marginBottom: 8
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleReply(message.id)}
                          style={{
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Yanıt Gönder
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          style={{
                            background: '#6c757d',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: message.isRead ? '#6c757d' : '#ffc107',
                    fontWeight: 600
                  }}>
                    {message.isRead ? '✓ Okundu' : '● Okunmadı'}
                    {message.adminReply && ' | ✓ Yanıtlandı'}
                  </div>
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
                    color: comment.isApproved ? '#28a745' : '#ffc107',
                    fontWeight: 600
                  }}>
                    {comment.isApproved ? '✓ Onaylı' : '● Onay Bekliyor'}
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