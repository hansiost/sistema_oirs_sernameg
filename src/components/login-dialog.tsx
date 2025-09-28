'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

const rutSchema = z
  .string()
  .min(8, 'El RUT debe tener al menos 8 caracteres.')
  .regex(
    /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]$/,
    'Formato de RUT no válido.'
  );

export function LoginDialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    const rutValidation = rutSchema.safeParse(rut);
    if (!rutValidation.success) {
      setError(rutValidation.error.flatten().fieldErrors.rut?.[0] || 'RUT inválido.');
      return;
    }
    if (password.length < 4) {
      setError('La clave es obligatoria.');
      return;
    }
    setError('');
    setIsLoggingIn(true);
    // Simulate API call
    setTimeout(() => {
      // On successful login, redirect to status page
      router.push('/solicitud/estado');
      setIsLoggingIn(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <Image
            src="https://www.sernameg.gob.cl/wp-content/uploads/2018/03/logo-gob-horizontal-e1521743034336.png"
            alt="Logo Gobierno de Chile"
            width={180}
            height={40}
            className="mb-4"
          />
          <DialogTitle className="text-2xl">
            Iniciar sesión con ClaveÚnica
          </DialogTitle>
          <DialogDescription>
            Ingresa tu RUT y ClaveÚnica para continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="rut">RUT</Label>
            <Input
              id="rut"
              type="text"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              disabled={isLoggingIn}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">ClaveÚnica</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingIn}
            />
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </div>
        <Button onClick={handleLogin} disabled={isLoggingIn} size="lg">
          {isLoggingIn ? (
            <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.Login className="mr-2 h-4 w-4" />
          )}
          Continuar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
