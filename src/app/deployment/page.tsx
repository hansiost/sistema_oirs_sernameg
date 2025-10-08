
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowLeft, Info, GitBranch, AlertTriangle } from 'lucide-react';
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
                   Has conectado tu repositorio de GitHub. Ahora, cada vez que subas cambios, tu aplicación se desplegará automáticamente.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                
                 <Alert variant="default" className="text-left bg-blue-50 border-blue-200 text-blue-900">
                  <Info className="h-4 w-4 !text-blue-700" />
                  <AlertTitle className="text-blue-900">Tu Próximo Paso: Inicia el Despliegue con `git push`</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    Tu despliegue se iniciará (o se reintentará si falló) automáticamente cuando subas (`push`) el código de tu proyecto a la rama principal de tu repositorio de GitHub.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <GitBranch className="h-4 w-4" />
                  <AlertTitle>¿Cómo funciona?</AlertTitle>
                  <AlertDescription>
                    <ol className="list-decimal list-inside space-y-2 mt-2">
                        <li>Abre la terminal en Firebase Studio.</li>
                        <li>Ejecuta `git add .`, `git commit -m "Mi mensaje"`, y `git push`.</li>
                        <li>Firebase App Hosting detectará los cambios y comenzará a desplegar la nueva versión.</li>
                        <li>Podrás ver el progreso del despliegue en la consola de Firebase, en la sección de App Hosting.</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>¿Si el despliegue falla?</AlertTitle>
                  <AlertDescription>
                    Si la compilación vuelve a fallar, revisa los "Registros de Cloud Build" en la consola de Firebase para ver el detalle del error. Si es un error de código, corrígelo aquí y vuelve a hacer `git push`.
                  </AlertDescription>
                </Alert>

                 <Button asChild variant="outline" className="mt-6">
                    <Link href="/backoffice_oirs/dashboard">
                        <ArrowLeft className="mr-2" />
                        Volver al Dashboard
                    </Link>
                </Button>
                
            </CardContent>
        </Card>
    </div>
  );
}
