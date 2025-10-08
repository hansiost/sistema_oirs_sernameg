
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowLeft, Info, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function DeploymentPage() {
  const { toast } = useToast();
  const [appUrl, setAppUrl] = useState<string | null>(null);

  useEffect(() => {
    // This ensures we only access window object on the client side
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
    }
  }, []);

  const handleCopyUrl = () => {
    if (!appUrl) return;
    navigator.clipboard.writeText(appUrl)
      .then(() => {
        toast({
          title: 'URL Copiada',
          description: 'La URL de la aplicación ha sido copiada a tu portapapeles.',
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          variant: 'destructive',
          title: 'Error al copiar',
          description: 'No se pudo copiar la URL. Por favor, cópiala manualmente.',
        });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
        <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Rocket className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Tu Aplicación está en Vivo</CardTitle>
                <CardDescription>
                    Tu proyecto se despliega automáticamente con Firebase App Hosting.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>¿Cómo compartir tu aplicación?</AlertTitle>
                  <AlertDescription>
                    Usa la siguiente URL pública para compartir tu aplicación.
                  </AlertDescription>
                </Alert>

                <div className="flex w-full max-w-md mx-auto items-center space-x-2">
                  {appUrl ? (
                    <Input value={appUrl} readOnly />
                  ) : (
                    <Skeleton className="h-10 w-full" />
                  )}
                  <Button onClick={handleCopyUrl} disabled={!appUrl} aria-label="Copiar URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                 <div className="pt-4">
                     <Button variant="outline" asChild>
                        <Link href="/backoffice_oirs/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Backoffice
                        </Link>
                    </Button>
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
