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
import { CheckCircle } from 'lucide-react';
import { REQUEST_TYPES } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const mockSolicitudes = [
  {
    folio: '98765',
    tipo: 'Queja',
    fecha: '2024-07-20',
    descripcion: 'Demora excesiva en la atención telefónica del centro de la mujer...',
    estado: 'Respondida',
  },
  {
    folio: '98123',
    tipo: 'Consulta',
    fecha: '2024-07-15',
    descripcion: 'Consulta sobre los requisitos para postular al programa Mujeres Jefas de Hogar...',
    estado: 'En proceso',
  },
  {
    folio: '97543',
    tipo: 'Sugerencia',
    fecha: '2024-06-28',
    descripcion: 'Sugerencia para implementar talleres de alfabetización digital para adultas mayores...',
    estado: 'Enviada',
  },
  {
    folio: '96881',
    tipo: 'Reclamo',
    fecha: '2024-06-10',
    descripcion: 'Reclamo por falta de accesibilidad en edificio de la dirección regional...',
    estado: 'Respondida',
  },
];

// Mocked user data from "Registro Civil"
const mockUserData = {
  rut: '12.345.678-9',
  nombres: 'Juana Andrea',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'González',
};


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

export default function EstadoSolicitudesPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const newFolio = searchParams?.folio;
  let allSolicitudes = [...mockSolicitudes];

  if (newFolio) {
    const newRequest = {
      folio: newFolio as string,
      tipo: (searchParams.tipo as (typeof REQUEST_TYPES)[number]) || 'Consulta',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: 'Nueva solicitud recién enviada...',
      estado: 'Enviada'
    }
    allSolicitudes = [newRequest, ...mockSolicitudes];
  }


  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
      <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Link>
        </Button>
        <Button asChild>
          <Link href="/solicitud">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Solicitud
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl space-y-8">
        {newFolio && (
          <div className="p-4 bg-green-50 text-green-900 rounded-lg flex items-start space-x-3 border border-green-200">
             <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-500" />
             <div className="flex-1">
               <h3 className="font-bold">¡Solicitud enviada con éxito!</h3>
               <p>
                 Su solicitud ha sido registrada con el folio <strong>N° {newFolio}</strong>. Puede revisar el estado de todas sus solicitudes a continuación.
               </p>
             </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Mis Datos</CardTitle>
            <CardDescription>
              Esta información es obtenida del Registro Civil y no puede ser modificada.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>RUT</Label>
              <Input value={mockUserData.rut} disabled />
            </div>
            <div className="space-y-1">
              <Label>Nombres</Label>
              <Input value={mockUserData.nombres} disabled />
            </div>
            <div className="space-y-1">
              <Label>Apellido Paterno</Label>
              <Input value={mockUserData.apellidoPaterno} disabled />
            </div>
            <div className="space-y-1">
              <Label>Apellido Materno</Label>
              <Input value={mockUserData.apellidoMaterno} disabled />
            </div>
          </CardContent>
        </Card>


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
                  <TableHead className="w-[100px]">N° de Caso</TableHead>
                  <TableHead>Tipo Solicitud</TableHead>
                  <TableHead>Fecha de Envío</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Estado Solicitud</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSolicitudes.map((solicitud) => (
                  <TableRow key={solicitud.folio}>
                    <TableCell className="font-medium">{solicitud.folio}</TableCell>
                    <TableCell>{solicitud.tipo}</TableCell>
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
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
