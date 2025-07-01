import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg,rgb(78, 80, 184) 0%,rgba(39, 44, 135, 0.86) 100%)',
      color: '#fff',
      padding: '0.7rem 1.2rem',
      marginTop: 'auto'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        
        {/* İletişim Bilgileri */}
        <div>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            marginBottom: '0.5rem',
            color: '#3498db',
            textAlign: 'center'
          }}>
            İletişim
          </h4>
          <div style={{ 
            color: '#bdc3c7', 
            lineHeight: '1.8', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'row',
            gap: '2.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '0.98rem'
          }}>
            <span>📍 Çankaya/ANKARA </span>
            <span>📧 zelissyldrm0@gmail.com</span>
            <span>📞 0546 625 9657</span>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: '0.5rem',
        textAlign: 'center',
        color: '#95a5a6',
        fontSize: '0.85rem',
        lineHeight: 1.5
      }}>
        <div>© 2024 ZELİŞLE GEZELİM. Tüm hakları saklıdır.</div>
        <div>Gizlilik Politikası: Kişisel bilgileriniz gizli tutulur ve üçüncü kişilerle paylaşılmaz.</div>
      </div>
    </footer>
  );
};

export default Footer; 