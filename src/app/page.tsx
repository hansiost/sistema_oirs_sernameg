
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-landing');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="relative w-full h-[30vh] md:h-[40vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </header>
      
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:py-12 -mt-20 md:-mt-24 z-10">
        <div className="bg-background/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary leading-tight mt-6">
            Portal Ciudadano SERNAMEG
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-prose mx-auto">
            Bienvenida a nuestro portal de solicitudes. Aquí puede ingresar sus reclamos, consultas, sugerencias y felicitaciones de forma segura y directa.
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
            Será dirigida al formulario de solicitud para completar su trámite.
          </p>
        </div>
      </main>

      <footer className="w-full text-center p-6 text-sm text-muted-foreground">
        <p>© 2024 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
