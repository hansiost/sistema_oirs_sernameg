import Link from 'next/link';
import RegistroForm from './registro-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function RegistroPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
      <header className="w-full max-w-4xl mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Icons.Register className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Registro de Usuario
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Ingrese su RUT para comenzar. Sus datos personales se completarán
            automáticamente. Luego, podrá agregar su información de contacto.
          </p>
        </div>
        <RegistroForm />
      </main>
      <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
