import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-landing');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="relative w-full h-64 md:h-80">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover object-top"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </header>
      
      <main className="flex-grow w-full -mt-24 md:-mt-32 z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center bg-background/80 backdrop-blur-sm p-6 rounded-lg">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary leading-tight">
              Portal Ciudadano
            </h1>
            <p className="mt-2 text-2xl md:text-3xl text-foreground/80">
              Servicio Nacional de la Mujer y la Equidad de Género
            </p>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-prose mx-auto">
              Bienvenida a nuestro portal de solicitudes. Aquí puede ingresar reclamos, consultas, sugerencias, quejas o felicitaciones de forma segura y directa.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-bold text-lg">
                <Link href="/solicitud">
                  <Icons.Login />
                  Ingresar con Clave Única
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              Se le dirigirá al formulario de solicitud.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full text-center p-4 text-xs text-muted-foreground">
        <p>© 2024 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
