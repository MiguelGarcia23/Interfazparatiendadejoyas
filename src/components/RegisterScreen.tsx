import { useState } from 'react';
import { Gem, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RegisterScreenProps {
  onRegister: (isAdmin: boolean) => void;
  onBackToLogin: () => void;
}

export function RegisterScreen({ onRegister, onBackToLogin }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validaciones
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (!formData.username) newErrors.username = 'El usuario es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulación de registro - los nuevos usuarios son clientes por defecto
    onRegister(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error del campo cuando se edita
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl">
              <Gem className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate en Nicole Albagli
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Elige un nombre de usuario"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
              {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
              />
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full">
              Registrarse
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio de sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}