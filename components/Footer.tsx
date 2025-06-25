import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{
      background: '#2c3e50',
      color: '#fff',
      padding: '3rem 2rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* Hakkımızda */}
        <div>
          <h3 style={{ 
            fontSize: '1.3rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: '#3498db'
          }}>
            ZELİŞLE GEZELİM
          </h3>
          <p style={{ 
            color: '#bdc3c7', 
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            Gezi deneyimlerimizi paylaştığımız, yeni yerler keşfetmenize yardımcı olan blog sitemize hoş geldiniz.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: '#3498db', fontSize: '1.5rem' }}>📘</a>
            <a href="#" style={{ color: '#3498db', fontSize: '1.5rem' }}>📷</a>
            <a href="#" style={{ color: '#3498db', fontSize: '1.5rem' }}>📱</a>
          </div>
        </div>

        {/* Hızlı Linkler */}
        <div>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: '#3498db'
          }}>
            Hızlı Linkler
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/" style={{ color: '#bdc3c7', textDecoration: 'none' }}>
                Anasayfa
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/blog" style={{ color: '#bdc3c7', textDecoration: 'none' }}>
                Blog
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/iletisim" style={{ color: '#bdc3c7', textDecoration: 'none' }}>
                İletişim
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/create" style={{ color: '#bdc3c7', textDecoration: 'none' }}>
                Blog Oluştur
              </Link>
            </li>
          </ul>
        </div>

        {/* İletişim Bilgileri */}
        <div>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: '#3498db'
          }}>
            İletişim
          </h4>
          <div style={{ color: '#bdc3c7', lineHeight: '1.8' }}>
            <p>📍 Örnek Mahallesi, İstanbul</p>
            <p>📧 info@zelislegezelim.com</p>
            <p>📞 +90 (212) 123 45 67</p>
          </div>
        </div>

        {/* Bülten */}
        <div>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: '#3498db'
          }}>
            Bülten
          </h4>
          <p style={{ 
            color: '#bdc3c7', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            Yeni blog yazılarımızdan haberdar olmak için e-posta adresinizi girin.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="E-posta adresiniz"
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #34495e',
                borderRadius: '4px',
                backgroundColor: '#34495e',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>
              Abone Ol
            </button>
          </div>
        </div>
      </div>

      {/* Alt Çizgi */}
      <div style={{ 
        borderTop: '1px solid #34495e', 
        marginTop: '2rem', 
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#95a5a6',
        fontSize: '0.9rem'
      }}>
        <p>&copy; 2024 ZELİŞLE GEZELİM. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer; 