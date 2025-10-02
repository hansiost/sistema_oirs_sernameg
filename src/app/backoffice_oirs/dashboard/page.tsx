
'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PlusCircle } from 'lucide-react';

const mockSolicitudes = [
  {
    id: 'AB-12345',
    fechaEnvio: '2024-07-28',
    tipo: 'Consulta',
    tema: 'Derechos de la mujer',
    oficina: 'Metropolitana de Santiago',
    ciudadano: 'Juana Pérez',
    estado: 'Ingresada',
    fechaRespuesta: null,
    tiempoRestante: '5 días',
  },
  {
    id: 'CD-67890',
    fechaEnvio: '2024-07-27',
    tipo: 'Reclamo',
    tema: 'Atención deficiente en servicio público',
    oficina: 'Valparaíso',
    ciudadano: 'Ana López',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '3 días',
  },
  {
    id: 'EF-54321',
    fechaEnvio: '2024-07-25',
    tipo: 'Queja',
    tema: 'Conducta de funcionario/a',
    oficina: 'Biobío',
    ciudadano: 'María González',
    estado: 'Respondida',
    fechaRespuesta: '2024-07-26',
    tiempoRestante: '-',
  },
  {
    id: 'GH-98765',
    fechaEnvio: '2024-07-24',
    tipo: 'Sugerencia',
    tema: 'Mejora de servicios de atención',
    oficina: 'La Araucanía',
    ciudadano: 'Carla Soto',
    estado: 'Cerrada',
    fechaRespuesta: '2024-07-25',
    tiempoRestante: '-',
  },
  {
    id: 'IJ-11223',
    fechaEnvio: '2024-07-23',
    tipo: 'Felicitacion',
    tema: 'Buena atención recibida',
    oficina: 'Los Lagos',
    ciudadano: 'Luisa Martinez',
    estado: 'Cerrada',
    fechaRespuesta: '2024-07-23',
    tiempoRestante: '-',
  },
  {
    id: 'KL-33445',
    fechaEnvio: '2024-07-22',
    tipo: 'Consulta',
    tema: 'Programas de apoyo y orientación',
    oficina: 'Arica y Parinacota',
    ciudadano: 'Rosa Díaz',
    estado: 'Ingresada',
    fechaRespuesta: null,
    tiempoRestante: '2 días',
  },
   {
    id: 'MN-55667',
    fechaEnvio: '2024-07-21',
    tipo: 'Reclamo',
    tema: 'Violencia intrafamiliar',
    oficina: 'Ñuble',
    ciudadano: 'Sara Muñoz',
    estado: 'En proceso (Urgente)',
    fechaRespuesta: null,
    tiempoRestante: '1 día',
  },
   {
    id: 'OP-77889',
    fechaEnvio: '2024-07-20',
    tipo: 'Consulta',
    tema: 'Asesoría legal',
    oficina: 'Atacama',
    ciudadano: 'Teresa Vargas',
    estado: 'Ingresada',
    fechaRespuesta: null,
    tiempoRestante: '8 días',
  },
   {
    id: 'QR-99001',
    fechaEnvio: '2024-07-19',
    tipo: 'Queja',
    tema: 'Demora excesiva en la atención',
    oficina: 'Coquimbo',
    ciudadano: 'Elena Silva',
    estado: 'Respondida',
    fechaRespuesta: '2024-07-22',
    tiempoRestante: '-',
  },
  {
    id: 'ST-10203',
    fechaEnvio: '2024-07-18',
    tipo: 'Sugerencia',
    tema: 'Campañas de difusión y sensibilización',
    oficina: 'Maule',
    ciudadano: 'Isabel Castro',
    estado: 'Cerrada',
    fechaRespuesta: '2024-07-19',
    tiempoRestante: '-',
  }
];

const ITEMS_PER_PAGE = 10;

const getStatusVariant = (estado: string) => {
  if (estado.includes('Urgente')) return 'destructive';
  if (estado === 'Ingresada') return 'outline';
  if (estado === 'En proceso') return 'secondary';
  if (estado === 'Respondida') return 'default';
  return 'default';
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

export default function BackofficeDashboard() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(mockSolicitudes.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentSolicitudes = mockSolicitudes.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Bandeja de Entrada de Solicitudes</CardTitle>
            <CardDescription>
            Aquí se muestran las últimas solicitudes ciudadanas recibidas.
            </CardDescription>
        </div>
        <Button asChild>
            <Link href="/solicitud">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Solicitud
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Solicitud</TableHead>
                <TableHead>Fecha envío</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tema</TableHead>
                <TableHead>Oficina Regional</TableHead>
                <TableHead>Nombre Ciudadano</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Respuesta</TableHead>
                <TableHead>Tiempo Restante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSolicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell className="font-medium">{solicitud.id}</TableCell>
                  <TableCell>{formatDate(solicitud.fechaEnvio)}</TableCell>
                  <TableCell>{solicitud.tipo}</TableCell>
                  <TableCell>{solicitud.tema}</TableCell>
                  <TableCell>{solicitud.oficina}</TableCell>
                  <TableCell>{solicitud.ciudadano}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(solicitud.estado) as any}>
                      {solicitud.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(solicitud.fechaRespuesta)}</TableCell>
                  <TableCell>{solicitud.tiempoRestante}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
       <CardFooter>
        <div className="flex justify-between w-full items-center">
            <div className="text-xs text-muted-foreground">
                Página {currentPage} de {totalPages}
            </div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} aria-disabled={currentPage === 1} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handleNextPage(); }} aria-disabled={currentPage === totalPages}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
      </CardFooter>
    </Card>
  );
}
