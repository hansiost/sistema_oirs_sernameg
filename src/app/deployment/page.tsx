
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
                  <AlertTitle className="text-blue-900">Tu Próximo Paso: Despliega con `git push`</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    Tu despliegue se iniciará automáticamente cuando subas (`push`) el código de tu proyecto a la rama principal de tu repositorio de GitHub.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <GitBranch className="h-4 w-4" />
                  <AlertTitle>¿Cómo hacerlo desde la terminal de Studio?</AlertTitle>
                  <AlertDescription>
                    <ol className="list-decimal list-inside space-y-2 mt-2 text-left">
                        <li><b>(Si es la primera vez)</b> Configura tu repositorio remoto:
                            <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-x-auto"><code>git remote add origin [URL_DE_TU_REPO]</code></pre>
                        </li>
                        <li><b>(Si el `push` fue rechazado)</b> Trae y combina los cambios remotos (ej: un README inicial):
                            <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-x-auto"><code>git pull origin main --allow-unrelated-histories</code></pre>
                        </li>
                        <li>Agrega, confirma y sube tus cambios:
                           <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-x-auto"><code>git add .<br/>git commit -m "Mi mensaje de commit"<br/>git push origin main</code></pre>
                        </li>
                        <li>Firebase App Hosting detectará los cambios y comenzará el despliegue.</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>¿Y si el despliegue falla?</AlertTitle>
                  <AlertDescription className="text-left">
                    Si la compilación falla después de un `push`, revisa los "Registros de Cloud Build" en la consola de Firebase para ver el detalle del error. Si es un error de código, corrígelo aquí y vuelve a hacer `git push`.
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
