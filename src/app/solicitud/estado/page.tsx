import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

const mockSolicitudes = [
  {
    folio: '98765',
    fecha: '2024-07-20',
    descripcion: 'Demora excesiva en la atención telefónica del centro de la mujer...',
    estado: 'Respondida',
  },
  {
    folio: '98123',
    fecha: '2024-07-15',
    descripcion: 'Consulta sobre los requisitos para postular al programa Mujeres Jefas de Hogar...',
    estado: 'En proceso',
  },
  {
    folio: '97543',
    fecha: '2024-06-28',
    descripcion: 'Sugerencia para implementar talleres de alfabetización digital para adultas mayores...',
    estado: 'Enviada',
  },
  {
    folio: '96881',
    fecha: '2024-06-10',
    descripcion: 'Reclamo por falta de accesibilidad en edificio de la dirección regional...',
    estado: 'Respondida',
  },
];

const getStatusVariant = (estado: string) => {
  switch (estado) {
    case 'Respondida':
      return 'default';
    case 'En proceso':
      return 'secondary';
    case 'Enviada':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function EstadoSolicitudesPage() {
  const newFolio = Math.floor(Math.random() * 90000 + 10000);
  const newRequest = {
    folio: newFolio.toString(),
    fecha: new Date().toISOString().split('T')[0],
    descripcion: 'Nueva solicitud recién enviada...',
    estado: 'Enviada'
  }
  const allSolicitudes = [newRequest, ...mockSolicitudes]


  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
      <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/solicitud">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Formulario
          </Link>
        </Button>
        <Button asChild>
          <Link href="/solicitud">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Solicitud
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <Alert className="mb-8 border-green-500 bg-green-50 text-green-900">
           <CheckCircle className="h-4 w-4 !text-green-500" />
           <AlertTitle className="font-bold">¡Solicitud enviada con éxito!</AlertTitle>
           <AlertDescription>
             Su solicitud ha sido registrada con el folio <strong>N° {newFolio}</strong>. Puede revisar el estado de todas sus solicitudes a continuación.
           </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Mis Solicitudes</CardTitle>
            <CardDescription>
              Aquí puede ver el historial y el estado de todas sus solicitudes ingresadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Folio</TableHead>
                  <TableHead>Fecha de Envío</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSolicitudes.map((solicitud) => (
                  <TableRow key={solicitud.folio}>
                    <TableCell className="font-medium">{solicitud.folio}</TableCell>
                    <TableCell>{new Date(solicitud.fecha).toLocaleDateString('es-CL')}</TableCell>
                    <TableCell>{solicitud.descripcion.substring(0, 30)}...</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusVariant(solicitud.estado) as any}>
                        {solicitud.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
        <p>© 2024 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
