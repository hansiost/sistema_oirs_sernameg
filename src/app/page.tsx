
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="relative w-full text-center py-6 bg-primary/10">
        <div className="inline-block">
          <Image
            src="https://www.sernameg.gob.cl/wp-content/uploads/2021/07/logo-sernameg-barra.svg"
            alt="Logo SERNAMEG"
            width={300}
            height={50}
            priority
            className="h-12 w-auto"
          />
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:py-12 z-10">
        <div className="bg-background/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary leading-tight mt-6">
            Portal Ciudadano SERNAMEG
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-prose mx-auto">
            Bienvenida a nuestro portal de solicitudes. Aquí puede ingresar sus reclamos, consultas, sugerencias y felicitaciones de forma segura y directa.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-bold text-lg">
              <Link href="/solicitud/estado">
                <Icons.Login />
                Ingresar con Clave Única
              </Link>
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground/80">
              Será dirigida al portal para revisar y crear solicitudes.
            </p>
            <Link
              href="/registro"
              className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              <Icons.Register className="mr-2 h-4 w-4" />
              O regístrese aquí con su RUT
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full text-center p-6 text-sm text-muted-foreground">
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
