'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowLeft, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DeploymentPage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
        <Card className="w-full max-w-2xl">
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
                    Actualmente, te encuentras en un entorno de desarrollo privado. Para compartir una versión pública de tu aplicación, necesitas desplegarla.
                    <br/><br/>
                    El despliegue se activa cuando conectas tu proyecto de Firebase a un repositorio de código (como GitHub). Una vez conectado, cada cambio que subas se publicará automáticamente en tu URL pública, que será:
                    <br/>
                    <strong className="block my-2 p-2 bg-muted rounded-md">https://[ID-DE-TU-PROYECTO].apphosting.dev</strong>
                    <br/>
                    Podrás encontrar el ID de tu proyecto en la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-semibold underline">Consola de Firebase</a>.
                  </AlertDescription>
                </Alert>

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
