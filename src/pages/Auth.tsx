import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Loader2, Eye, EyeOff, Settings2 } from "lucide-react";
import { z } from "zod";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { API_CONFIG } from "@/config/api";

const loginSchema = z.object({
  correo: z.string().email("Correo inválido"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  correo: z.string().email("Correo inválido"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  perfil_id: z.string().min(1, "El perfil_id es requerido"),
});

export default function Auth() {
  const { isAuthenticated, isLoading, login, register, updateApiUrls } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showApiConfig, setShowApiConfig] = useState(false);
  
  // API URLs
  const [loginUrl, setLoginUrl] = useState(API_CONFIG.LOGIN_URL);
  const [registerUrl, setRegisterUrl] = useState(API_CONFIG.REGISTER_URL);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    correo: "",
    contraseña: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    perfil_id: "",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(loginForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    updateApiUrls(loginUrl, registerUrl);
    await login(loginForm);
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(registerForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    updateApiUrls(loginUrl, registerUrl);
    await register(registerForm);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      {/* Logo Header */}
      <div className="mb-8 flex flex-col items-center gap-3 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
          <Leaf className="h-9 w-9 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold">
          Turin<span className="text-gradient">Clean</span>
        </h1>
        <p className="text-muted-foreground">Gestión de rutas y vehículos</p>
      </div>

      <Card className="w-full max-w-md animate-fade-in shadow-xl" style={{ animationDelay: "0.1s" }}>
        <Tabs defaultValue="login" className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            {/* API Configuration
            <Collapsible open={showApiConfig} onOpenChange={setShowApiConfig} className="mb-6">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="mb-2 w-full justify-start text-muted-foreground">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Configurar URLs de API
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 rounded-lg bg-muted/50 p-4">
                <div className="space-y-2">
                  <Label htmlFor="loginUrl" className="text-xs">URL de Login</Label>
                  <Input
                    id="loginUrl"
                    value={loginUrl}
                    onChange={(e) => setLoginUrl(e.target.value)}
                    placeholder="https://tu-api.com/auth/login"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerUrl" className="text-xs">URL de Registro</Label>
                  <Input
                    id="registerUrl"
                    value={registerUrl}
                    onChange={(e) => setRegisterUrl(e.target.value)}
                    placeholder="https://tu-api.com/auth/register"
                    className="text-xs"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible> */}

            {/* Login Tab */}
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Correo electrónico</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={loginForm.correo}
                    onChange={(e) => setLoginForm({ ...loginForm, correo: e.target.value })}
                  />
                  {errors.correo && <p className="text-xs text-destructive">{errors.correo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginForm.contraseña}
                      onChange={(e) => setLoginForm({ ...loginForm, contraseña: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.contraseña && <p className="text-xs text-destructive">{errors.contraseña}</p>}
                </div>

                <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="mt-0">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nombre">Nombre</Label>
                    <Input
                      id="register-nombre"
                      placeholder="Juan"
                      value={registerForm.nombre}
                      onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
                    />
                    {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-apellido">Apellido</Label>
                    <Input
                      id="register-apellido"
                      placeholder="Pérez"
                      value={registerForm.apellido}
                      onChange={(e) => setRegisterForm({ ...registerForm, apellido: e.target.value })}
                    />
                    {errors.apellido && <p className="text-xs text-destructive">{errors.apellido}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Correo electrónico</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={registerForm.correo}
                    onChange={(e) => setRegisterForm({ ...registerForm, correo: e.target.value })}
                  />
                  {errors.correo && <p className="text-xs text-destructive">{errors.correo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerForm.contraseña}
                      onChange={(e) => setRegisterForm({ ...registerForm, contraseña: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.contraseña && <p className="text-xs text-destructive">{errors.contraseña}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-perfil">Perfil ID</Label>
                  <Input
                    id="register-perfil"
                    placeholder="uuid-del-perfil"
                    value={registerForm.perfil_id}
                    onChange={(e) => setRegisterForm({ ...registerForm, perfil_id: e.target.value })}
                  />
                  {errors.perfil_id && <p className="text-xs text-destructive">{errors.perfil_id}</p>}
                </div>

                <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
        © 2025 TurinClean. Todos los derechos reservados.
      </p>
    </div>
  );
}
