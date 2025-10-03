
import Link from 'next/link';
import SolicitudInternaForm from './solicitud-interna-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SolicitudInternaPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
      <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Portada
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold text-primary">
            Formulario de Ingreso de Solicitud Interna
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Ingrese el RUT del ciudadano para comenzar. Sus datos se cargarán y luego podrá completar la solicitud en su nombre.
          </p>
        </div>
        <SolicitudInternaForm />
      </main>
      <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
