
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
                <CardTitle className="text-3xl">¡Listo para Desplegar!</CardTitle>
                <CardDescription>
                   Has conectado tu repositorio. Ahora, cada vez que subas cambios a GitHub, tu aplicación se desplegará automáticamente.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                
                <Alert variant="default" className="text-left bg-green-50 border-green-200 text-green-900">
                  <Info className="h-4 w-4 !text-green-700" />
                  <AlertTitle className="text-green-900">Tu Próximo Paso: Sube tus Cambios con Git</AlertTitle>
                  <AlertDescription className="text-green-800">
                    Tu primer despliegue se iniciará automáticamente cuando subas (`push`) el código de tu proyecto a la rama principal de tu repositorio de GitHub.
                  </AlertDescription>
                </Alert>

                <Card className="text-left">
                    <CardHeader className="flex-row items-center gap-3">
                        <GitBranch className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>¿Cómo funciona el despliegue?</CardTitle>
                            <CardDescription>Sigue estos pasos en la terminal de este entorno de desarrollo.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                            <li>
                                <strong>Agrega tus cambios:</strong> Abre la terminal y ejecuta el comando: <br/>
                                <code className="font-mono bg-muted p-1 rounded-sm text-xs">git add .</code>
                            </li>
                             <li>
                                <strong>Crea un commit:</strong> Registra tus cambios con un mensaje descriptivo: <br/>
                                <code className="font-mono bg-muted p-1 rounded-sm text-xs">git commit -m "Versión inicial para despliegue"</code>
                            </li>
                             <li>
                                <strong>Sube a GitHub:</strong> Ejecuta el siguiente comando para iniciar el despliegue: <br/>
                                <code className="font-mono bg-muted p-1 rounded-sm text-xs">git push</code>
                            </li>
                             <li>
                                <strong>Monitorea el despliegue:</strong> Ve a la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-semibold underline text-primary">Consola de Firebase</a>, selecciona tu proyecto y en <strong>Build &gt; App Hosting</strong> podrás ver el progreso.
                            </li>
                        </ol>
                         <p className="text-xs text-muted-foreground mt-4">
                            Una vez finalizado, tu aplicación estará disponible en la URL pública: <br/> <strong className="font-mono">https://[ID-DE-TU-PROYECTO].apphosting.dev</strong>
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
