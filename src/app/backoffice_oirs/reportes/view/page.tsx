
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Table } from 'lucide-react';
import { mockReports, type Reporte } from '@/lib/mock-data-reports';
import SampleTableReport from './sample-table-report';
import SampleDashboardReport from './sample-dashboard-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ReportViewContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');

  const report = mockReports.find(r => r.id === reportId);

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporte no encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El reporte solicitado no existe o no se ha podido cargar.</p>
        </CardContent>
      </Card>
    );
  }

  const ReportIcon = report.tipo === 'Dashboard' ? BarChart3 : Table;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <ReportIcon className="h-6 w-6 text-primary" />
                    {report.nombre}
                </h1>
                <p className="text-muted-foreground">{report.descripcion}</p>
            </div>
            <Button variant="outline" asChild>
                <Link href="/backoffice_oirs/reportes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la lista
                </Link>
            </Button>
        </div>

        {report.tipo === 'Tabla' ? (
            <SampleTableReport />
        ) : (
            <SampleDashboardReport />
        )}
    </div>
  );
}


export default function ReportViewPage() {
    return (
        <Suspense fallback={<div>Cargando reporte...</div>}>
            <ReportViewContent />
        </Suspense>
    );
}

