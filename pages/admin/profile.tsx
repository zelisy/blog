import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export default function AdminProfile() {
  const [admin, setAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userInfo = JSON.parse(userData);
      if (userInfo.role !== 'ADMIN') {
        router.push('/profile');
        return;
      }
      setAdmin(userInfo);
      fetchUsers();
    } else {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeletingUserId(userToDelete.id);
    try {
      const res = await fetch(`/api/users?userId=${userToDelete.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // Kullanıcı listesini güncelle
        setUsers(users.filter(user => user.id !== userToDelete.id));
        alert('Kullanıcı başarıyla silindi!');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Kullanıcı silinirken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Bir hata oluştu!');
    } finally {
      setDeletingUserId(null);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
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
  
  if (!admin) return null;

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      {/* Admin Profil Başlığı */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
          Admin Profil
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
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              <strong>Ad:</strong> {admin.name}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              <strong>Email:</strong> {admin.email}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              <strong>Rol:</strong> {admin.role}
            </p>
          </div>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{
          margin: '0 0 1.5rem 0',
          color: '#333',
          fontSize: '1.5rem'
        }}>
          Kayıtlı Kullanıcılar ({users.length})
        </h2>
        
        {users.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            Henüz kayıtlı kullanıcı bulunmuyor.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {users.map((user) => (
              <div key={user.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1.5rem',
                background: '#f8f9fa',
                transition: 'transform 0.2s ease-in-out',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: user.role === 'ADMIN' ? '#f093fb' : '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 0.25rem 0',
                      color: '#333',
                      fontSize: '1.1rem'
                    }}>
                      {user.name}
                    </h3>
                    <span style={{
                      background: user.role === 'ADMIN' ? '#f093fb' : '#667eea',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Kullanıcı'}
                    </span>
                  </div>
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteClick(user)}
                      disabled={deletingUserId === user.id}
                      style={{
                        background: deletingUserId === user.id ? '#6c757d' : '#dc3545',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: deletingUserId === user.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        minWidth: '60px'
                      }}
                    >
                      {deletingUserId === user.id ? 'Siliniyor...' : 'Sil'}
                    </button>
                  )}
                </div>
                <p style={{
                  margin: 0,
                  color: '#666',
                  fontSize: '0.9rem',
                  wordBreak: 'break-word'
                }}>
                  {user.email}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Silme Onay Dialog'u */}
      {showDeleteConfirm && userToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#333',
              fontSize: '1.3rem'
            }}>
              Kullanıcıyı Sil
            </h3>
            <p style={{
              margin: '0 0 1.5rem 0',
              color: '#666',
              lineHeight: '1.6'
            }}>
              <strong>{userToDelete.name}</strong> kullanıcısını silmek istediğinizden emin misiniz? 
              Bu işlem geri alınamaz.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleDeleteCancel}
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
              <button
                onClick={handleDeleteConfirm}
                style={{
                  background: '#dc3545',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 