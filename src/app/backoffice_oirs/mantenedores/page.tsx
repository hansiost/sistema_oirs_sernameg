
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database } from 'lucide-react';

export default function MantenedoresPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Database />
            <span>Sección de Mantenedores</span>
        </CardTitle>
        <CardDescription>
          Seleccione una de las opciones del menú lateral para comenzar a administrar las tablas de parámetros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Aquí podrá gestionar las listas de opciones que se usan en los formularios del sistema, como tipos de solicitud, regiones, géneros, etc.</p>
      </CardContent>
    </Card>
  );
}
