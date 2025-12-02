import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState, LoginCredentials, RegisterData } from "@/types";
import { API_CONFIG } from "@/config/api";
import { toast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateApiUrls: (loginUrl: string, registerUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "turinclean_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [loginUrl, setLoginUrl] = useState(API_CONFIG.LOGIN_URL);
  const [registerUrl, setRegisterUrl] = useState(API_CONFIG.REGISTER_URL);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setState({
        user,
        token,
        isAuthenticated: !!token,
        isLoading: false,
      });
    }
    else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const updateApiUrls = (newLoginUrl: string, newRegisterUrl: string) => {
    setLoginUrl(newLoginUrl);
    setRegisterUrl(newRegisterUrl);
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      const user: User = data.user;
      const token = data.token;

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });


      toast({
        title: "¡Bienvenido!",
        description: `Hola ${user.nombre}, has iniciado sesión correctamente.`,
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error instanceof Error ? error.message : "No se pudo iniciar sesión",
      });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al registrarse");
      }

      const responseData = await response.json();
      const user: User = responseData.user || responseData;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: "¡Registro exitoso!",
        description: `Bienvenido ${user.nombre}, tu cuenta ha sido creada.`,
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error instanceof Error ? error.message : "No se pudo completar el registro",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateApiUrls }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
