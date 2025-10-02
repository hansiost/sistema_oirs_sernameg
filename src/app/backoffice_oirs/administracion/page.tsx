
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdministracionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings />
          <span>Sección de Administración</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Esta sección está en construcción. Aquí se gestionarán usuarios, parámetros y otras configuraciones.</p>
      </CardContent>
    </Card>
  );
}
