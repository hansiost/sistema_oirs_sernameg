import Link from 'next/link';
import SolicitudForm from './solicitud-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SolicitudPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center py-8 px-4">
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
          <h1 className="font-headline text-4xl font-bold text-primary-foreground/90">
            Formulario de Solicitud
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Complete los siguientes campos para ingresar su solicitud. Los campos marcados con * son obligatorios.
          </p>
        </div>
        <SolicitudForm />
      </main>
      <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
        <p>© 2024 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
