"// Manejo de autenticaci�n" 
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Lee usuario guardado en localStorage al iniciar
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Función que actualiza estado y localStorage juntos
  const setUserAndSave = (user) => {
    setUser(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  // login 
  const login = (username, password) => {
    if (username === "admin" && password === "1234") {
      setUserAndSave({ username });
      navigate("/");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  // logout
  const logout = () => {
    setUserAndSave(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acceder a todo el contexto
export function useAuth() {
  return useContext(AuthContext);
}
