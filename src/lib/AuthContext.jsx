import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

/**
 * Rotas públicas não exigem login global; o painel do gestor usa login próprio em GestorLogin.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
  }, []);

  const checkAppState = async () => {
    setAuthError(null);
  };

  const checkUserAuth = async () => {
    setIsAuthenticated(!!user);
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.href = "/gestor-inicial";
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/gestor-inicial";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
        setUser,
        setAppPublicSettings,
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
