
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function ReportesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BarChart3/>
            <span>Sección de Reportes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Esta sección está en construcción. Aquí se mostrarán los reportes y estadísticas.</p>
      </CardContent>
    </Card>
  );
}
