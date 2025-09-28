'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Icons } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LoginDialog } from '@/components/login-dialog';
import { useState } from 'react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-landing');
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState<'claveUnica' | 'rut'>('claveUnica');

  const handleLoginClick = (type: 'claveUnica' | 'rut') => {
    setLoginType(type);
    setShowLogin(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="relative w-full h-64 md:h-80">
        {heroImage && (
           <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-primary/30" />
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:py-12 -mt-24 z-10">
        <div className="bg-background/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary leading-tight">
            Portal Ciudadano SERNAMEG
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-prose mx-auto">
            Bienvenida a nuestro portal de solicitudes. Aquí puede ingresar sus reclamos, consultas, sugerencias y felicitaciones de forma segura y directa.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => handleLoginClick('claveUnica')} size="lg" className="font-bold text-lg bg-blue-600 hover:bg-blue-700">
                <Icons.Login />
                Ingresar con ClaveÚnica
              </Button>
              <Button onClick={() => handleLoginClick('rut')} size="lg" className="font-bold text-lg" variant="secondary">
                <Icons.Login />
                Ingresar con RUT
              </Button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground/80">
              Seleccione un método de ingreso para continuar.
            </p>
          </div>
        </div>
      </main>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} type={loginType} />

      <footer className="w-full text-center p-6 text-sm text-muted-foreground">
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
