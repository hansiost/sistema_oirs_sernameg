'use client';
import { useState, useMemo, ChangeEvent, FC } from 'react';
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
import { ArrowUpDown, FilePenLine } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


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
  },
  {
    id: 'UV-21314',
    fechaEnvio: '2024-07-17',
    tipo: 'Consulta',
    tema: 'Salud sexual y reproductiva',
    oficina: 'Antofagasta',
    ciudadano: 'Carolina Romero',
    estado: 'Ingresada',
    fechaRespuesta: null,
    tiempoRestante: '10 días',
  },
  {
    id: 'WX-42536',
    fechaEnvio: '2024-07-16',
    tipo: 'Reclamo',
    tema: 'Publicidad sexista',
    oficina: 'Metropolitana de Santiago',
    ciudadano: 'Valeria Torres',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '6 días',
  },
  {
    id: 'YZ-63758',
    fechaEnvio: '2024-07-15',
    tipo: 'Queja',
    tema: 'Falta de respuesta a solicitud previa',
    oficina: 'Valparaíso',
    ciudadano: 'Gabriela Flores',
    estado: 'Respondida',
    fechaRespuesta: '2024-07-18',
    tiempoRestante: '-',
  },
  {
    id: 'BC-74869',
    fechaEnvio: '2024-07-14',
    tipo: 'Felicitacion',
    tema: 'Efectividad de un programa o servicio',
    oficina: 'Biobío',
    ciudadano: 'Mónica Reyes',
    estado: 'Cerrada',
    fechaRespuesta: '2024-07-14',
    tiempoRestante: '-',
  },
  {
    id: 'DE-85970',
    fechaEnvio: '2024-07-13',
    tipo: 'Sugerencia',
    tema: 'Nuevos programas o talleres',
    oficina: 'La Araucanía',
    ciudadano: 'Patricia Morales',
    estado: 'Cancelada',
    fechaRespuesta: '2024-07-14',
    tiempoRestante: '-',
  },
  {
    id: 'FG-96081',
    fechaEnvio: '2024-07-12',
    tipo: 'Consulta',
    tema: 'Participación política y social',
    oficina: 'Los Lagos',
    ciudadano: 'Verónica Castillo',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '9 días',
  },
  {
    id: 'HI-17293',
    fechaEnvio: '2024-07-11',
    tipo: 'Reclamo',
    tema: 'Maltrato laboral',
    oficina: 'Arica y Parinacota',
    ciudadano: 'Daniela Herrera',
    estado: 'En proceso (Urgente)',
    fechaRespuesta: null,
    tiempoRestante: '4 días',
  },
  {
    id: 'JK-28304',
    fechaEnvio: '2024-07-10',
    tipo: 'Queja',
    tema: 'Procedimientos institucionales confusos',
    oficina: 'Ñuble',
    ciudadano: 'Natalia Núñez',
    estado: 'Respondida',
    fechaRespuesta: '2024-07-13',
    tiempoRestante: '-',
  },
  {
    id: 'LM-39415',
    fechaEnvio: '2024-07-09',
    tipo: 'Sugerencia',
    tema: 'Colaboración con otras entidades',
    oficina: 'Atacama',
    ciudadano: 'Paula Orellana',
    estado: 'Cerrada',
    fechaRespuesta: '2024-07-10',
    tiempoRestante: '-',
  },
  {
    id: 'NO-40526',
    fechaEnvio: '2024-07-08',
    tipo: 'Felicitacion',
    tema: 'Agradecimiento a funcionario/a o equipo',
    oficina: 'Coquimbo',
    ciudadano: 'Constanza Rojas',
    estado: 'Cerrada',
    fechaRespuesta: '2024-07-08',
    tiempoRestante: '-',
  },
  {
    id: 'PQ-51637',
    fechaEnvio: '2024-07-07',
    tipo: 'Consulta',
    tema: 'Derechos de la mujer',
    oficina: 'Maule',
    ciudadano: 'Andrea Vega',
    estado: 'Ingresada',
    fechaRespuesta: null,
    tiempoRestante: '15 días',
  },
  {
    id: 'RS-62748',
    fechaEnvio: '2024-07-06',
    tipo: 'Reclamo',
    tema: 'Violencia intrafamiliar',
    oficina: 'Antofagasta',
    ciudadano: 'Fernanda Ríos',
    estado: 'En proceso (Urgente)',
    fechaRespuesta: null,
    tiempoRestante: '3 días',
  },
  {
    id: 'TU-73859',
    fechaEnvio: '2024-07-05',
    tipo: 'Queja',
    tema: 'Infraestructura inadecuada',
    oficina: 'Metropolitana de Santiago',
    ciudadano: 'Marcela Fuentes',
    estado: 'Respondida',
    fechaRespuesta: '2024-07-08',
    tiempoRestante: '-',
  },
  {
    id: 'VW-84960',
    fechaEnvio: '2024-07-04',
    tipo: 'Sugerencia',
    tema: 'Mejorar accesibilidad de la información',
    oficina: 'Valparaíso',
    ciudadano: 'Ximena Paredes',
    estado: 'Ingresada',
    fechaRespuesta: null,
    tiempoRestante: '18 días',
  },
  {
    id: 'XY-95071',
    fechaEnvio: '2024-07-03',
    tipo: 'Felicitacion',
    tema: 'Iniciativa destacada',
    oficina: 'Biobío',
    ciudadano: 'Javiera Bravo',
    estado: 'Cerrada',
    fechaRespuesta: '2024-07-03',
    tiempoRestante: '-',
  },
  {
    id: 'ZA-06182',
    fechaEnvio: '2024-07-02',
    tipo: 'Consulta',
    tema: 'Programas de apoyo y orientación',
    oficina: 'La Araucanía',
    ciudadano: 'Catalina Araya',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '14 días',
  },
  {
    id: 'AC-17293',
    fechaEnvio: '2024-07-01',
    tipo: 'Reclamo',
    tema: 'Atención deficiente en servicio público',
    oficina: 'Los Lagos',
    ciudadano: 'Camila Espinoza',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '11 días',
  },
  {
    id: 'CE-28304',
    fechaEnvio: '2024-06-30',
    tipo: 'Queja',
    tema: 'Conducta de funcionario/a',
    oficina: 'Arica y Parinacota',
    ciudadano: 'Valentina Maldonado',
    estado: 'Respondida',
    fechaRespuesta: '2024-07-02',
    tiempoRestante: '-',
  },
  {
    id: 'EG-39415',
    fechaEnvio: '2024-06-29',
    tipo: 'Sugerencia',
    tema: 'Mejora de servicios de atención',
    oficina: 'Ñuble',
    ciudadano: 'Sofía Contreras',
    estado: 'Cerrada',
    fechaRespuesta: '2024-06-30',
    tiempoRestante: '-',
  },
];


type SortConfig = {
  key: keyof Solicitud;
  direction: 'ascending' | 'descending';
} | null;

const getStatusVariant = (estado: string) => {
  if (estado.includes('Urgente')) return 'destructive';
  if (estado === 'Ingresada') return 'outline';
  if (estado === 'En proceso') return 'secondary';
  if (estado === 'Respondida') return 'default';
  if (estado === 'Cancelada') return 'destructive';
  return 'default';
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    // Check if the date string is in 'YYYY-MM-DD' format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
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


interface SolicitudesTableProps {
    solicitudes: Solicitud[];
}


const SolicitudesTable: FC<SolicitudesTableProps> = ({ solicitudes }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
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
        let filtered = [...solicitudes];

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
    }, [filters, sortConfig, solicitudes]);

    const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSolicitudes = filteredSolicitudes.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    return (
        <div className="space-y-4">
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
                    {currentSolicitudes.length > 0 ? currentSolicitudes.map((solicitud) => (
                        <TableRow key={solicitud.id} className="text-xs">
                        <TableCell className="font-medium">
                            <Button variant="link" asChild className="p-0 h-auto">
                            <Link href={`/solicitud-interna?id=${solicitud.id}`}>
                                {solicitud.id}
                            </Link>
                            </Button>
                        </TableCell>
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
                    )) : (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length} className="h-24 text-center">
                                No hay solicitudes para mostrar.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between w-full items-center">
                <div className="text-xs text-muted-foreground">
                    Mostrando {Math.min(itemsPerPage, currentSolicitudes.length)} de {filteredSolicitudes.length} solicitudes.
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Items por página:</span>
                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                            <SelectTrigger className="h-8 w-20">
                                <SelectValue placeholder={itemsPerPage} />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 30, 40, 50].map(size => (
                                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Página {currentPage} de {totalPages}.
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
            </div>
        </div>
    );
};


export default function BackofficeDashboard() {
    const solicitudesEnProceso = useMemo(() => 
        mockSolicitudes.filter(s => ['Ingresada', 'En proceso', 'En proceso (Urgente)'].includes(s.estado)), 
    []);

    const solicitudesCerradas = useMemo(() => 
        mockSolicitudes.filter(s => ['Respondida', 'Cerrada', 'Cancelada'].includes(s.estado)), 
    []);

    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Bandeja de Entrada de Solicitudes</CardTitle>
                <CardDescription>
                Aquí se muestran las últimas solicitudes ciudadanas recibidas.
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild variant="secondary">
                    <Link href="/solicitud-interna">
                        <FilePenLine className="mr-2 h-4 w-4" />
                        Crear Solicitud Interna
                    </Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="en-proceso">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en-proceso">Solicitudes en Proceso</TabsTrigger>
                    <TabsTrigger value="cerradas">Solicitudes Cerradas</TabsTrigger>
                </TabsList>
                <TabsContent value="en-proceso" className="mt-4">
                    <SolicitudesTable solicitudes={solicitudesEnProceso} />
                </TabsContent>
                <TabsContent value="cerradas" className="mt-4">
                    <SolicitudesTable solicitudes={solicitudesCerradas} />
                </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
    );
}
