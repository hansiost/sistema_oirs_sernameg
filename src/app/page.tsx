import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-landing');

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        <Card className="overflow-hidden shadow-2xl shadow-primary/10">
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-foreground/90 leading-tight">
                Portal Ciudadano
                <span className="block text-accent-foreground/80 text-3xl md:text-4xl">SERNAMEG</span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-prose">
                Bienvenida a nuestro portal de solicitudes. Aquí puede ingresar reclamos, consultas, sugerencias, quejas o felicitaciones de forma segura y directa.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="font-bold">
                  <Link href="/solicitud">
                    <Icons.Login />
                    Ingresar con Clave Única
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="font-bold">
                  <Link href="/solicitud">
                    <Icons.Register />
                    Ingresar con RUT
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                Ambas opciones le dirigirán al formulario de solicitud.
              </p>
            </div>
            <div className="relative min-h-[250px] md:min-h-0">
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
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
