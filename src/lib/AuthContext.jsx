import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

/**
 * Rotas públicas não exigem login global; o painel do gestor usa login próprio em GestorLogin.
 */
export const AuthProvider = ({ children }) => {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);

  useEffect(() => {
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
  }, []);

  const navigateToLogin = () => {
    window.location.href = "/gestor-inicial";
  };

  return (
    <AuthContext.Provider
      value={{
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        navigateToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
