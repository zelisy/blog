import React, { useState, useContext, createContext } from 'react';
import Link from 'next/link';

// Kullanıcı prop'u ekliyoruz (ileride context ile değiştirilecek)
interface User {
  name: string;
  role: 'USER' | 'ADMIN';
}

// AuthContext hazırlığı (ileride ayrı dosyaya alınabilir)
const AuthContext = createContext<{ user?: User; logout?: () => void }>({});
export const useAuth = () => useContext(AuthContext);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e0e0e0',
      background: 'linear-gradient(135deg,rgb(78, 102, 209) 0%,rgb(110, 63, 156) 100%)',
      color: '#fff'
    }}>
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer' }}>
          <img src="/logo.png" alt="Logo" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          Zeliş'le Rotalar
        </div>
      </Link>
      
      {/* Navigation Menu */}
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 500, fontSize: '1.1rem' }}>
          Anasayfa
        </Link>
        <Link href="/blog" style={{ textDecoration: 'none', color: '#fff', fontWeight: 500, fontSize: '1.1rem' }}>
          Blog Yazıları
        </Link>
        <Link href="/iletisim" style={{ textDecoration: 'none', color: '#fff', fontWeight: 500, fontSize: '1.1rem' }}>
          İletişim
        </Link>
      </nav>
      
      <div>
        {!user ? (
          <>
            <Link href="/login"><button style={{ marginRight: '1rem', background: '#667eea', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Giriş Yap</button></Link>
            <Link href="/register"><button style={{ background: '#764ba2', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Kayıt Ol</button></Link>
          </>
        ) : (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={() => setMenuOpen(v => !v)} style={{ background: '#f093fb', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{user.name} ▼</button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 8, minWidth: 160, zIndex: 10 }}>
                <Link href="/profile"><div style={{ padding: '10px 16px', cursor: 'pointer', color: '#333' }}>Profil</div></Link>
                {user.role === 'ADMIN' && <Link href="/admin"><div style={{ padding: '10px 16px', cursor: 'pointer', color: '#333' }}>Admin Panel</div></Link>}
                <div style={{ padding: '10px 16px', cursor: 'pointer', color: 'red' }} onClick={logout}>Çıkış Yap</div>
              </div>
            )}
          </div>
        )}
        {user && (
          <Link href="/create"><button style={{ marginRight: '1rem', background: '#f5576c', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Blog Oluştur</button></Link>
        )}
      </div>
    </header>
  );
};

export { AuthContext };
export default Header; 