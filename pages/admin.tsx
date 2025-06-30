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
            <div>Blog yönetim alanı</div>
          ) : (
            <div>Yorum yönetim alanı</div>
          )
        )}
      </div>
    </div>
  );
}
