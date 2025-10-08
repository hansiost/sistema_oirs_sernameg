
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowLeft, Info, GitBranch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DeploymentPage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
        <Card className="w-full max-w-3xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Rocket className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Despliegue Automático con App Hosting</CardTitle>
                <CardDescription>
                    Tu aplicación se despliega automáticamente en una URL pública cada vez que envías cambios a tu repositorio de GitHub conectado.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                
                <Alert variant="default" className="text-left bg-green-50 border-green-200 text-green-900">
                  <Info className="h-4 w-4 !text-green-700" />
                  <AlertTitle className="text-green-900">¡Siguiente Paso: Sube tus Cambios!</AlertTitle>
                  <AlertDescription className="text-green-800">
                    Ahora que tu repositorio de GitHub está conectado, simplemente tienes que **hacer un `push` con tus cambios** a la rama principal. Esta acción iniciará automáticamente tu primer despliegue.
                  </AlertDescription>
                </Alert>

                <Card className="text-left">
                    <CardHeader className="flex-row items-center gap-3">
                        <GitBranch className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>¿Cómo funciona el despliegue?</CardTitle>
                            <CardDescription>Tu URL pública se activa con tu primer despliegue.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Usa los comandos de Git (`git add`, `git commit`, `git push`) para subir el código de tu proyecto al repositorio que conectaste.</li>
                            <li>Ve a la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-semibold underline text-primary">Consola de Firebase</a> y selecciona tu proyecto.</li>
                            <li>En el menú, ve a <strong>Build &gt; App Hosting</strong>. Podrás ver el progreso de la compilación y el despliegue.</li>
                            <li>Una vez finalizado, tu aplicación estará disponible en la URL pública.</li>
                        </ol>
                         <p className="text-xs text-muted-foreground mt-4">
                            La URL pública para este proyecto es: <br/> <strong className="font-mono">https://{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "[ID-DE-TU-PROYECTO]"}.apphosting.dev</strong>
                        </p>
                    </CardContent>
                </Card>

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
