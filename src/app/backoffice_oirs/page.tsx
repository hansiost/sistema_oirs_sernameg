
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
import { Building2 } from 'lucide-react';

export default function BackofficeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    // Simulate API call for backoffice login
    setTimeout(() => {
      if (email === 'admin@sernameg.gob.cl' && password === 'admin') {
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
                <div className="inline-flex items-center justify-center text-primary-foreground bg-primary rounded-full p-4 mb-4">
                    <Building2 className="h-12 w-12" />
                </div>
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
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ej: admin@sernameg.gob.cl"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoggingIn}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Clave</Label>
                    <Button variant="link" asChild className="text-xs px-0">
                        <Link href="#">
                            ¿Olvidó su clave?
                        </Link>
                    </Button>
                </div>
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
