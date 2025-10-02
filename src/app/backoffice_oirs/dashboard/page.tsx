
'use client';
import { useState, useMemo, ChangeEvent } from 'react';
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
import { Input } from '@/components/ui/input';
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
import { PlusCircle, ArrowUpDown } from 'lucide-react';

type Solicitud = {
    id: string;
    fechaEnvio: string;
    tipo: string;
    tema: string;
    oficina: string;
    ciudadano: string;
    estado: string;
    fechaRespuesta: string | null;
    tiempoRestante: string;
}

const mockSolicitudes: Solicitud[] = [
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

type SortConfig = {
  key: keyof Solicitud;
  direction: 'ascending' | 'descending';
} | null;

const getStatusVariant = (estado: string) => {
  if (estado.includes('Urgente')) return 'destructive';
  if (estado === 'Ingresada') return 'outline';
  if (estado === 'En proceso') return 'secondary';
  if (estado === 'Respondida') return 'default';
  return 'default';
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    // Check if the date string is in 'YYYY-MM-DD' format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};


export default function BackofficeDashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Partial<Record<keyof Solicitud, string>>>({});
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fechaEnvio', direction: 'descending' });

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>, key: keyof Solicitud) => {
        setFilters(prev => ({...prev, [key]: e.target.value }));
        setCurrentPage(1);
    };

    const requestSort = (key: keyof Solicitud) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredSolicitudes = useMemo(() => {
        let filtered = [...mockSolicitudes];

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                filtered = filtered.filter(solicitud => {
                    const solValue = solicitud[key as keyof Solicitud];
                    return solValue?.toString().toLowerCase().includes(value.toLowerCase());
                });
            }
        });
        
        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key]! < b[sortConfig.key]!) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key]! > b[sortConfig.key]!) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [filters, sortConfig]);

    const totalPages = Math.ceil(filteredSolicitudes.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentSolicitudes = filteredSolicitudes.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
    
    const tableHeaders: { key: keyof Solicitud, label: string, sortable: boolean }[] = [
        { key: 'id', label: 'N° Solicitud', sortable: true },
        { key: 'fechaEnvio', label: 'Fecha envío', sortable: true },
        { key: 'tipo', label: 'Tipo', sortable: false },
        { key: 'tema', label: 'Tema', sortable: false },
        { key: 'oficina', label: 'Oficina Regional', sortable: false },
        { key: 'ciudadano', label: 'Nombre Ciudadano', sortable: false },
        { key: 'estado', label: 'Estado', sortable: false },
        { key: 'fechaRespuesta', label: 'Fecha Respuesta', sortable: false },
        { key: 'tiempoRestante', label: 'Tiempo Restante', sortable: false },
    ];


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
                {tableHeaders.map(header => (
                    <TableHead key={header.key}>
                        {header.sortable ? (
                            <Button variant="ghost" onClick={() => requestSort(header.key)}>
                                {header.label}
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            header.label
                        )}
                    </TableHead>
                ))}
              </TableRow>
              <TableRow>
                {tableHeaders.map(header => (
                    <TableHead key={`${header.key}-filter`}>
                       {header.key !== 'fechaRespuesta' && header.key !== 'tiempoRestante' ? (
                            <Input
                                placeholder={`Filtrar...`}
                                value={filters[header.key] || ''}
                                onChange={(e) => handleFilterChange(e, header.key)}
                                className="h-8"
                            />
                        ) : (<div />)}
                    </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSolicitudes.map((solicitud) => (
                <TableRow key={solicitud.id} className="text-xs">
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
                Mostrando {currentSolicitudes.length} de {filteredSolicitudes.length} solicitudes. Página {currentPage} de {totalPages}.
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
