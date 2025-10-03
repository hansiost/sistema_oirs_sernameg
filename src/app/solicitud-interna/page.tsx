
import Link from 'next/link';
import SolicitudInternaForm from './solicitud-interna-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

export default function SolicitudInternaPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
      <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/backoffice_oirs/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <Suspense fallback={<div>Cargando...</div>}>
            <SolicitudInternaForm />
        </Suspense>
      </main>
      <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

    