
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function RootPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-landing');
  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="w-full p-4 border-b flex justify-center">
         <Image
            src={heroImage?.imageUrl || "https://www.sernameg.gob.cl/wp-content/uploads/2021/11/logo-sernameg-2021-horizontal-1.png"}
            alt="Logo SERNAMEG"
            width={200}
            height={48}
            style={{ width: '200px', height: 'auto' }}
          />
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary leading-tight">
              Bienvenidas y Bienvenidos
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Seleccione el portal al que desea ingresar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-8 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105">
               <div className="bg-primary/10 p-4 rounded-full mb-4">
                 <ArrowRight className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold font-headline text-primary mb-4">Portal Ciudadano</h2>
              <p className="text-muted-foreground mb-6">
                Para ingresar reclamos, consultas, sugerencias y felicitaciones de forma segura y directa.
              </p>
              <Button asChild size="lg" className="w-full font-bold text-lg">
                <Link href="/portal_ciudadano">
                  Ingresar al Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="border rounded-lg p-8 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105">
               <div className="bg-accent/10 p-4 rounded-full mb-4">
                <ShieldCheck className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">Backoffice OIRS</h2>
              <p className="text-muted-foreground mb-6">
                Para la gestión interna de solicitudes, casos y estadísticas por parte de funcionarios/as.
              </p>
              <Button asChild size="lg" className="w-full font-bold text-lg" variant="outline">
                <Link href="/backoffice_oirs">
                  Ingresar al Backoffice
                   <ShieldCheck className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full text-center p-6 text-sm text-muted-foreground">
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
