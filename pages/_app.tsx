import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header, { AuthContext } from "@/components/Header";
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
      <Header />
      <Component {...pageProps} login={login} />
    </AuthContext.Provider>
  );
}
