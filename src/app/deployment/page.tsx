
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
                <CardTitle className="text-3xl">Tu Aplicación está Lista para Desplegarse</CardTitle>
                <CardDescription>
                    Tu proyecto se despliega automáticamente con Firebase App Hosting cada vez que se realizan cambios en tu repositorio de código.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>¿Cómo funciona el despliegue público?</AlertTitle>
                  <AlertDescription>
                    Actualmente, te encuentras en un entorno de desarrollo privado. Para obtener una URL pública y compartir tu aplicación, necesitas conectarla a un repositorio de código (como GitHub), lo cual activa el despliegue automático.
                  </AlertDescription>
                </Alert>

                <Card className="text-left">
                    <CardHeader className="flex-row items-center gap-3">
                        <GitBranch className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Conecta tu Repositorio de GitHub</CardTitle>
                            <CardDescription>Sigue estos pasos en la Consola de Firebase:</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Ve a la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-semibold underline text-primary">Consola de Firebase</a> y selecciona tu proyecto.</li>
                            <li>En el menú de la izquierda, ve a <strong>Build &gt; App Hosting</strong>.</li>
                            <li>En el dashboard de App Hosting, busca y haz clic en la opción para <strong>conectar un repositorio de GitHub</strong>.</li>
                            <li>Sigue las instrucciones para autorizar y seleccionar tu repositorio.</li>
                        </ol>
                         <p className="text-xs text-muted-foreground mt-4">
                            Una vez conectado, cada `git push` a tu rama principal desplegará automáticamente los cambios a tu URL pública: <br/> <strong className="font-mono">https://[ID-DE-TU-PROYECTO].apphosting.dev</strong>
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
