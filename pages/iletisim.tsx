import React, { useState } from 'react';

export default function Iletisim() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Mesaj gönderilemedi');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', padding: '2rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem', color: '#333', textAlign: 'center' }}>
          İletişim
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '2rem', color: '#333' }}>
              İletişim Bilgileri
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3498db' }}>
                Adres
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Örnek Mahallesi, Örnek Sokak No:123<br />
                İstanbul, Türkiye
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3498db' }}>
                E-posta
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                info@zelislegezelim.com
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3498db' }}>
                Telefon
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                +90 (212) 123 45 67
              </p>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '2rem', color: '#333' }}>
              Mesaj Gönder
            </h2>

            {success && (
              <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                Mesajınız başarıyla gönderildi!
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                  Konu *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                  Mesaj *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#3498db',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 