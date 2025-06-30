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
    // Kullanıcı bilgilerini localStorage'dan al
    const userData = localStorage.getItem('user');
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
      setEditForm({
        name: userInfo.name,
        email: userInfo.email
      });
    } else {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgba(255, 255, 255, 0.99) 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: 800, 
        margin: '40px auto', 
        padding: 32, 
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 40,
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: 20
        }}>
          <h1 style={{ 
            color: '#2c3e50', 
            fontWeight: 800, 
            fontSize: '2.5rem',
            marginBottom: 8
          }}>
            Profil Bilgileri
          </h1>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: user.role === 'ADMIN' ? '#e74c3c' : '#3498db',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ 
            background: user.role === 'ADMIN' ? '#e74c3c' : '#3498db',
            color: '#fff',
            padding: '4px 16px',
            borderRadius: 20,
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'inline-block'
          }}>
            {user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 24,
            marginBottom: 24
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontWeight: 600, 
                color: '#2c3e50',
                fontSize: '0.95rem'
              }}>
                Ad Soyad
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #ddd',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f8f9fa', 
                  borderRadius: 8,
                  border: '1px solid #e9ecef',
                  fontSize: '1rem',
                  color: '#495057'
                }}>
                  {user.name}
                </div>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontWeight: 600, 
                color: '#2c3e50',
                fontSize: '0.95rem'
              }}>
                E-posta
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #ddd',
                    borderRadius: 8,
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f8f9fa', 
                  borderRadius: 8,
                  border: '1px solid #e9ecef',
                  fontSize: '1rem',
                  color: '#495057'
                }}>
                  {user.email}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontWeight: 600, 
              color: '#2c3e50',
              fontSize: '0.95rem'
            }}>
              Hesap Türü
            </label>
            <div style={{ 
              padding: '12px 16px', 
              background: '#f8f9fa', 
              borderRadius: 8,
              border: '1px solid #e9ecef',
              fontSize: '1rem',
              color: '#495057'
            }}>
              {user.role === 'ADMIN' ? 'Yönetici (Admin)' : 'Standart Kullanıcı'}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontWeight: 600, 
              color: '#2c3e50',
              fontSize: '0.95rem'
            }}>
              Kayıt Tarihi
            </label>
            <div style={{ 
              padding: '12px 16px', 
              background: '#f8f9fa', 
              borderRadius: 8,
              border: '1px solid #e9ecef',
              fontSize: '1rem',
              color: '#495057'
            }}>
              {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: 16, 
          justifyContent: 'center',
          borderTop: '2px solid #f0f0f0',
          paddingTop: 24
        }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  background: '#27ae60',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                Kaydet
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: '#95a5a6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                İptal
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              style={{
                background: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Bilgileri Düzenle
            </button>
          )}
        </div>

        {user.role === 'ADMIN' && (
          <div style={{ 
            marginTop: 32, 
            padding: 20, 
            background: '#fff3cd', 
            borderRadius: 8,
            border: '1px solid #ffeaa7'
          }}>
            <h3 style={{ 
              color: '#856404', 
              marginBottom: 12,
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Yönetici Yetkileri
            </h3>
            <ul style={{ 
              color: '#856404', 
              margin: 0, 
              paddingLeft: 20,
              lineHeight: 1.6
            }}>
              <li>Blog yazılarını onaylama/reddetme</li>
              <li>Kullanıcı yönetimi</li>
              <li>Sistem ayarlarına erişim</li>
              <li>İstatistikleri görüntüleme</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 