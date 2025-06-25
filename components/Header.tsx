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
      borderBottom: '1px solid #eee',
      background: `linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%), url('/renk geçişi.jpg')`,
      backgroundBlendMode: 'overlay',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>ZELİŞLE GEZELİM</div>
      <div>
        {!user ? (
          <>
            <Link href="/login"><button style={{ marginRight: '1rem', background: 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#222', fontWeight: 600, cursor: 'pointer' }}>Giriş Yap</button></Link>
            <Link href="/register"><button style={{ background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#222', fontWeight: 600, cursor: 'pointer' }}>Kayıt Ol</button></Link>
          </>
        ) : (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={() => setMenuOpen(v => !v)} style={{ background: 'linear-gradient(90deg, #fcb69f 0%, #ffecd2 100%)', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#222', fontWeight: 600, cursor: 'pointer' }}>{user.name} ▼</button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 8, minWidth: 160, zIndex: 10 }}>
                <Link href="/profile"><div style={{ padding: '10px 16px', cursor: 'pointer' }}>Profil</div></Link>
                {user.role === 'ADMIN' && <Link href="/admin"><div style={{ padding: '10px 16px', cursor: 'pointer' }}>Admin Panel</div></Link>}
                <div style={{ padding: '10px 16px', cursor: 'pointer', color: 'red' }} onClick={logout}>Çıkış Yap</div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export { AuthContext };
export default Header; 