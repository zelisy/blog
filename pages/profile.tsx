import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

interface ContactMessage {
  id: number;
  subject: string;
  message: string;
  createdAt: string;
  adminReply?: string;
  repliedBy?: string;
  repliedAt?: string;
  isRead: boolean;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [adminMessagesLoading, setAdminMessagesLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
      setEditForm({
        name: userInfo.name,
        email: userInfo.email
      });
      fetchUserMessages(userInfo.email);
      fetchAdminMessages(userInfo.id);
    } else {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const fetchUserMessages = async (email: string) => {
    setMessagesLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const response = await fetch(`/api/contact?email=${encodeURIComponent(normalizedEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchAdminMessages = async (userId: number) => {
    setAdminMessagesLoading(true);
    try {
      const adminRes = await fetch('/api/profile?role=ADMIN');
      if (!adminRes.ok) return;
      const admin = await adminRes.json();
      if (!admin || !admin.id) return;
      const res = await fetch(`/api/messages?userId=${userId}&otherId=${admin.id}`);
      if (res.ok) {
        const data = await res.json();
        setAdminMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdminMessagesLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editForm,
          userId: user?.id
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedUser = result.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert('Profil bilgileri güncellendi!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Güncelleme başarısız!');
      }
    } catch (_error) {
      alert('Bir hata oluştu!');
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Profil</h1>
      <p>Ad: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role}</p>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />
          <button onClick={handleSave}>Kaydet</button>
          <button onClick={handleCancel}>İptal</button>
        </>
      ) : (
        <button onClick={handleEdit}>Düzenle</button>
      )}

      <h2>İletişim Mesajlarım</h2>
      {messagesLoading ? (
        <p>Mesajlar yükleniyor...</p>
      ) : messages.length === 0 ? (
        <p>Hiç mesaj yok.</p>
      ) : (
        <ul>
          {messages.map(msg => (
            <li key={msg.id}>
              <strong>{msg.subject}</strong> - {msg.message}
              {msg.adminReply && <p>Yanıt: {msg.adminReply}</p>}
            </li>
          ))}
        </ul>
      )}

      <h2>Admin Mesajları</h2>
      {adminMessagesLoading ? (
        <p>Yükleniyor...</p>
      ) : adminMessages.length === 0 ? (
        <p>Admin'den mesaj yok.</p>
      ) : (
        <ul>
          {adminMessages.map(msg => (
            <li key={msg.id}>
              <p>{msg.sender.role === 'ADMIN' ? 'Admin' : 'Siz'}: {msg.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
