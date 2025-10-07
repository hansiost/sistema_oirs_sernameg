
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';

export default function PermisosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <KeyRound />
            <span>Sección de Permisos</span>
        </CardTitle>
        <CardDescription>
          Administración de roles y permisos del sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Esta sección se encuentra en construcción.</p>
      </CardContent>
    </Card>
  );
}
