
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ExternalLink, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DeploymentPage() {
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  useEffect(() => {
    // In a real scenario, this might be fetched or constructed.
    // For this environment, we can construct it from the current location.
    const url = new URL(window.location.href);
    // This logic assumes a specific format for the development environment URL.
    // It might need adjustment based on the actual live environment structure.
    const newHost = url.hostname.replace('7080-8080', '8080');
    const liveUrl = `${url.protocol}//${newHost}`;
    
    // Simulate a short delay to represent the deployment check
    const timer = setTimeout(() => {
        setDeploymentUrl(liveUrl);
    }, 1500);

    return () => clearTimeout(timer);

  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
        <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Rocket className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Tu Aplicación está en Vivo</CardTitle>
                <CardDescription>
                    Tu proyecto se despliega automáticamente. Puedes acceder a la versión publicada a través del siguiente enlace para compartirla.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="p-4 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">URL para compartir:</p>
                    {deploymentUrl ? (
                         <a
                            href={deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-mono text-primary underline break-all"
                        >
                            {deploymentUrl}
                        </a>
                    ) : (
                        <Skeleton className="h-7 w-full" />
                    )}
                </div>

                {deploymentUrl ? (
                    <Button asChild size="lg">
                        <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                            Abrir Aplicación
                            <ExternalLink className="ml-2 h-5 w-5" />
                        </a>
                    </Button>
                ) : (
                    <Button size="lg" disabled>
                        <Skeleton className="h-5 w-32" />
                    </Button>
                )}

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
