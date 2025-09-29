'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { Separator } from './ui/separator';

const rutSchema = z
  .string()
  .min(8, 'El RUT debe tener al menos 8 caracteres.')
  .regex(
    /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]$/,
    'Formato de RUT no válido.'
  );

export function LoginDialog({
  open,
  onOpenChange,
  type = 'claveUnica'
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'claveUnica' | 'rut';
}) {
  const router = useRouter();
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const rutValidation = rutSchema.safeParse(rut);
    if (!rutValidation.success) {
      setError('RUT inválido.');
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
      // On successful login, redirect based on login type
      const destination = type === 'claveUnica' ? '/solicitud' : '/solicitud/estado';
      router.push(destination);
      setIsLoggingIn(false);
      onOpenChange(false);
    }, 1500);
  };
  
  const title = type === 'claveUnica' ? 'Ingreso con ClaveÚnica' : 'Ingreso con RUT';
  const buttonText = type === 'claveUnica' ? 'Ingresar con ClaveÚnica' : 'Ingresar';
  const buttonClass = type === 'claveUnica' ? 'bg-blue-600 hover:bg-blue-700' : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {type === 'claveUnica' && (
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Logotipo_Clave_%C3%9Anica.svg"
              alt="Logo ClaveÚnica"
              width={180}
              height={45}
              className="mb-4"
            />
          )}
          <DialogTitle className="text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription>
            Ingrese su RUT y su clave para continuar.
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
            <Label htmlFor="password">Clave</Label>
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
        <div className='flex flex-col gap-2'>
           <Button onClick={handleLogin} disabled={isLoggingIn} size="lg" className={buttonClass}>
              {isLoggingIn ? (
                <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.Login className="mr-2 h-4 w-4" />
              )}
              {buttonText}
            </Button>
        </div>

        <Separator className="my-4" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">¿No tiene una cuenta?</p>
           <Button variant='link' asChild>
             <Link
                href="/registro"
                onClick={() => onOpenChange(false)}
              >
                <Icons.Register className="mr-2 h-4 w-4" />
                Regístrese aquí
              </Link>
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
