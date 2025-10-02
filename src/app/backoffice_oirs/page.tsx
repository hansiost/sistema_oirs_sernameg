
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function BackofficeLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    // Simulate API call for backoffice login
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        // On successful login, you would redirect to the backoffice dashboard
        // For now, let's just log it and reset.
        console.log('Backoffice login successful');
        // router.push('/backoffice_oirs/dashboard');
        alert('Inicio de sesión de Backoffice exitoso (simulado).');
      } else {
        setError('Usuario o clave incorrectos.');
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
            <Link href="/">
                <img
                    src="https://www.sernameg.gob.cl/wp-content/uploads/2021/11/logo-sernameg-2021-horizontal-1.png"
                    alt="Logo SERNAMEG"
                    className="mx-auto h-12 w-auto"
                />
            </Link>
        </div>
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Backoffice OIRS</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al panel de gestión.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="ej: juan.perez"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoggingIn}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Clave</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                />
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Ingresar
              </Button>
               <Button variant="link" asChild className="text-xs">
                <Link href="/">
                    Volver a la portada principal
                </Link>
            </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
