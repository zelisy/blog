import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}



export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });


  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userInfo = JSON.parse(userData);
      if (userInfo.role === 'ADMIN') {
        router.push('/admin/profile');
        return;
      }
      setUser(userInfo);
      setEditForm({
        name: userInfo.name,
        email: userInfo.email
      });
    } else {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);





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
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Yükleniyor...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      {/* Profil Başlığı */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          margin: '0 0 1rem 0',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Profil Bilgileri
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              <strong>Ad:</strong> {user.name}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              <strong>Rol:</strong> {user.role === 'USER' ? 'Kullanıcı' : 'Admin'}
            </p>
          </div>
        </div>
      </div>

      {/* Düzenleme Bölümü */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{
          margin: '0 0 1.5rem 0',
          color: '#333',
          fontSize: '1.5rem'
        }}>
          Profil Düzenle
        </h2>
        
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#555'
              }}>
                Ad:
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#555'
              }}>
                Email:
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleSave}
                style={{
                  background: '#667eea',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Kaydet
              </button>
              <button 
                onClick={handleCancel}
                style={{
                  background: '#6c757d',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                İptal
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleEdit}
            style={{
              background: '#667eea',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Düzenle
          </button>
        )}
      </div>
    </div>
  );
}
