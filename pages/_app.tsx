import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header, { AuthContext } from "@/components/Header";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // localStorage'dan kullanıcıyı yükle
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = (userObj: any) => {
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Component {...pageProps} login={login} />
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
