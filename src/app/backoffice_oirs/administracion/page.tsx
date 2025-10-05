
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdministracionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Settings />
            <span>Sección de Administración</span>
        </CardTitle>
        <CardDescription>
          Seleccione una de las opciones del menú lateral para comenzar a administrar el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Aquí podrá gestionar usuarios y permisos del sistema OIRS.</p>
      </CardContent>
    </Card>
  );
}
