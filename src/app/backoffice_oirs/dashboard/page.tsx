
'use client';
import { useState, useMemo, ChangeEvent, FC } from 'react';
import Link from 'next/link';
import { DateRange, DayPicker } from 'react-day-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge, BadgeProps } from '@/components/ui/badge';
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
import { ArrowUpDown, FilePenLine, Calendar as CalendarIcon, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { REQUEST_TYPES } from '@/lib/constants';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';


type Solicitud = {
    id: string;
    rut: string;
    fechaEnvio: string;
    tipo: string;
    tema: string;
    oficina: string;
    ciudadano: string;
    estado: string;
    fechaRespuesta: string | null;
    tiempoRestante: string;
    tiempoResolucion?: string;
    encuestaSatisfaccion?: number | null;
}

const mockSolicitudes: Solicitud[] = [
  {
    id: 'AB-12345',
    rut: '12.345.678-9',
    fechaEnvio: '2025-07-28',
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
    rut: '11.478.406-0',
    fechaEnvio: '2025-07-27',
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
    rut: '10.987.654-3',
    fechaEnvio: '2025-07-25',
    tipo: 'Queja',
    tema: 'Conducta de funcionario/a',
    oficina: 'Biobío',
    ciudadano: 'María González',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-26',
    tiempoRestante: '-',
    tiempoResolucion: '1 día',
    encuestaSatisfaccion: 4,
  },
  {
    id: 'GH-98765',
    rut: '13.456.789-K',
    fechaEnvio: '2025-07-24',
    tipo: 'Sugerencia',
    tema: 'Mejora de servicios de atención',
    oficina: 'La Araucanía',
    ciudadano: 'Carla Soto',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-25',
    tiempoRestante: '-',
    tiempoResolucion: '1 día',
    encuestaSatisfaccion: 5,
  },
  {
    id: 'IJ-11223',
    rut: '14.567.890-1',
    fechaEnvio: '2025-07-23',
    tipo: 'Felicitacion',
    tema: 'Buena atención recibida',
    oficina: 'Los Lagos',
    ciudadano: 'Luisa Martinez',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-23',
    tiempoRestante: '-',
    tiempoResolucion: '1 día',
    encuestaSatisfaccion: null,
  },
  {
    id: 'KL-33445',
    rut: '15.678.901-2',
    fechaEnvio: '2025-07-22',
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
    rut: '16.789.012-3',
    fechaEnvio: '2025-07-21',
    tipo: 'Reclamo',
    tema: 'Violencia intrafamiliar',
    oficina: 'Ñuble',
    ciudadano: 'Sara Muñoz',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '1 día',
  },
   {
    id: 'OP-77889',
    rut: '17.890.123-4',
    fechaEnvio: '2025-07-20',
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
    rut: '18.901.234-5',
    fechaEnvio: '2025-07-19',
    tipo: 'Queja',
    tema: 'Demora excesiva en la atención',
    oficina: 'Coquimbo',
    ciudadano: 'Elena Silva',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-22',
    tiempoRestante: '-',
    tiempoResolucion: '3 días',
    encuestaSatisfaccion: 2,
  },
  {
    id: 'ST-10203',
    rut: '19.012.345-6',
    fechaEnvio: '2025-07-18',
    tipo: 'Sugerencia',
    tema: 'Campañas de difusión y sensibilización',
    oficina: 'Maule',
    ciudadano: 'Isabel Castro',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-19',
    tiempoRestante: '-',
    tiempoResolucion: '1 día',
    encuestaSatisfaccion: null,
  },
  {
    id: 'UV-21314',
    rut: '20.123.456-7',
    fechaEnvio: '2025-07-17',
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
    rut: '21.234.567-8',
    fechaEnvio: '2025-07-16',
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
    rut: '22.345.678-9',
    fechaEnvio: '2025-07-15',
    tipo: 'Queja',
    tema: 'Falta de respuesta a solicitud previa',
    oficina: 'Valparaíso',
    ciudadano: 'Gabriela Flores',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-18',
    tiempoRestante: '-',
    tiempoResolucion: '3 días',
    encuestaSatisfaccion: 1,
  },
  {
    id: 'BC-74869',
    rut: '23.456.789-0',
    fechaEnvio: '2025-07-14',
    tipo: 'Felicitacion',
    tema: 'Efectividad de un programa o servicio',
    oficina: 'Biobío',
    ciudadano: 'Mónica Reyes',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-14',
    tiempoRestante: '-',
    tiempoResolucion: '0 días',
    encuestaSatisfaccion: null,
  },
  {
    id: 'DE-85970',
    rut: '24.567.890-K',
    fechaEnvio: '2025-07-13',
    tipo: 'Sugerencia',
    tema: 'Nuevos programas o talleres',
    oficina: 'La Araucanía',
    ciudadano: 'Patricia Morales',
    estado: 'Cancelada',
    fechaRespuesta: '2025-07-14',
    tiempoRestante: '-',
    tiempoResolucion: '1 día',
    encuestaSatisfaccion: null,
  },
  {
    id: 'FG-96081',
    rut: '7.890.123-4',
    fechaEnvio: '2025-07-12',
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
    rut: '8.901.234-5',
    fechaEnvio: '2025-07-11',
    tipo: 'Reclamo',
    tema: 'Maltrato laboral',
    oficina: 'Arica y Parinacota',
    ciudadano: 'Daniela Herrera',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '4 días',
  },
  {
    id: 'JK-28304',
    rut: '9.012.345-6',
    fechaEnvio: '2025-07-10',
    tipo: 'Queja',
    tema: 'Procedimientos institucionales confusos',
    oficina: 'Ñuble',
    ciudadano: 'Natalia Núñez',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-13',
    tiempoRestante: '-',
    tiempoResolucion: '3 días',
    encuestaSatisfaccion: 3,
  },
  {
    id: 'LM-39415',
    rut: '6.543.210-K',
    fechaEnvio: '2025-07-09',
    tipo: 'Sugerencia',
    tema: 'Colaboración con otras entidades',
    oficina: 'Atacama',
    ciudadano: 'Paula Orellana',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-10',
    tiempoRestante: '-',
    tiempoResolucion: '1 día',
  },
  {
    id: 'NO-40526',
    rut: '5.432.109-8',
    fechaEnvio: '2025-07-08',
    tipo: 'Felicitacion',
    tema: 'Agradecimiento a funcionario/a o equipo',
    oficina: 'Coquimbo',
    ciudadano: 'Constanza Rojas',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-08',
    tiempoRestante: '-',
    tiempoResolucion: '0 días',
  },
  {
    id: 'PQ-51637',
    rut: '4.321.098-7',
    fechaEnvio: '2025-07-07',
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
    rut: '3.210.987-6',
    fechaEnvio: '2025-07-06',
    tipo: 'Reclamo',
    tema: 'Violencia intrafamiliar',
    oficina: 'Antofagasta',
    ciudadano: 'Fernanda Ríos',
    estado: 'En proceso',
    fechaRespuesta: null,
    tiempoRestante: '3 días',
  },
  {
    id: 'TU-73859',
    rut: '2.109.876-5',
    fechaEnvio: '2025-07-05',
    tipo: 'Queja',
    tema: 'Infraestructura inadecuada',
    oficina: 'Metropolitana de Santiago',
    ciudadano: 'Marcela Fuentes',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-08',
    tiempoRestante: '-',
    tiempoResolucion: '3 días',
    encuestaSatisfaccion: 3,
  },
  {
    id: 'VW-84960',
    rut: '1.098.765-4',
    fechaEnvio: '2025-07-04',
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
    rut: '987.654-3',
    fechaEnvio: '2025-07-03',
    tipo: 'Felicitacion',
    tema: 'Iniciativa destacada',
    oficina: 'Biobío',
    ciudadano: 'Javiera Bravo',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-03',
    tiempoRestante: '-',
    tiempoResolucion: '0 días',
  },
  {
    id: 'ZA-06182',
    rut: '876.543-2',
    fechaEnvio: '2025-07-02',
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
    rut: '765.432-1',
    fechaEnvio: '2025-07-01',
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
    rut: '654.321-0',
    fechaEnvio: '2025-06-30',
    tipo: 'Queja',
    tema: 'Conducta de funcionario/a',
    oficina: 'Arica y Parinacota',
    ciudadano: 'Valentina Maldonado',
    estado: 'Respondida',
    fechaRespuesta: '2025-07-02',
    tiempoRestante: '-',
    tiempoResolucion: '2 días',
    encuestaSatisfaccion: 2,
  },
  {
    id: 'EG-39415',
    rut: '543.210-9',
    fechaEnvio: '2025-06-29',
    tipo: 'Sugerencia',
    tema: 'Mejora de servicios de atención',
    oficina: 'Ñuble',
    ciudadano: 'Sofía Contreras',
    estado: 'Respondida',
    fechaRespuesta: '2025-06-30',
    tiempoRestante: '-',
    tiempoResolucion: '1 día',
  },
];


type SortConfig = {
  key: keyof Solicitud;
  direction: 'ascending' | 'descending';
} | null;

const getTiempoRestanteVariant = (tiempoRestante: string): BadgeProps['variant'] => {
  if (tiempoRestante === '-') return 'outline';
  const dias = parseInt(tiempoRestante.split(' ')[0], 10);
  if (dias <= 2) return 'danger';
  if (dias >= 3 && dias <= 5) return 'warning';
  if (dias >= 6) return 'success';
  return 'outline';
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    // Check if the date string is in 'YYYY-MM-DD' format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};


interface SolicitudesTableProps {
    solicitudes: Solicitud[];
    isClosedTab?: boolean;
}

const ESTADOS_SOLICITUD = ['Ingresada', 'En proceso', 'Respondida', 'Cancelada'];


const SolicitudesTable: FC<SolicitudesTableProps> = ({ solicitudes, isClosedTab = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState<Partial<Record<keyof Solicitud, string>>>({});
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fechaEnvio', direction: 'descending' });

    const allHeaders: { key: keyof Solicitud, label: string, sortable: boolean }[] = [
        { key: 'id', label: 'N° Solicitud', sortable: true },
        { key: 'fechaEnvio', label: 'Fecha envío', sortable: true },
        { key: 'tipo', label: 'Tipo', sortable: false },
        { key: 'tema', label: 'Asunto', sortable: false },
        { key: 'oficina', label: 'Oficina Regional', sortable: false },
        { key: 'rut', label: 'RUT', sortable: true },
        { key: 'ciudadano', label: 'Nombre Ciudadano', sortable: false },
        { key: 'estado', label: 'Estado', sortable: false },
        { key: 'fechaRespuesta', label: 'Fecha Respuesta', sortable: false },
        { key: 'tiempoRestante', label: isClosedTab ? 'Tiempo Resolución' : 'Tiempo Restante', sortable: false },
        { key: 'encuestaSatisfaccion', label: 'Encuesta', sortable: false },
    ];
    
    const tableHeaders = useMemo(() => {
        if (isClosedTab) {
            return allHeaders;
        }
        return allHeaders.filter(header => header.key !== 'fechaRespuesta' && header.key !== 'encuestaSatisfaccion');
    }, [isClosedTab]);


    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>, key: keyof Solicitud) => {
        setFilters(prev => ({...prev, [key]: e.target.value }));
        setCurrentPage(1);
    };

    const handleSelectFilterChange = (value: string, key: keyof Solicitud) => {
      setFilters(prev => ({...prev, [key]: value === 'all' ? '' : value }));
      setCurrentPage(1);
    };

    const handleDateFilterChange = (date: Date | undefined, key: keyof Solicitud) => {
        const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
        setFilters(prev => ({ ...prev, [key]: formattedDate }));
        setCurrentPage(1);
    }

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
                if (key === 'tiempoRestante') {
                  filtered = filtered.filter(solicitud => {
                    const variant = getTiempoRestanteVariant(solicitud.tiempoRestante);
                    if (value === 'danger') return variant === 'danger';
                    if (value === 'warning') return variant === 'warning';
                    if (value === 'success') return variant === 'success';
                    return true;
                  });
                } else {
                  filtered = filtered.filter(solicitud => {
                      const solValue = solicitud[key as keyof Solicitud];
                      return solValue?.toString().toLowerCase().includes(value.toLowerCase());
                  });
                }
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
    
    const getCellValue = (solicitud: Solicitud, key: keyof Solicitud) => {
        switch (key) {
            case 'fechaEnvio':
            case 'fechaRespuesta':
                return formatDate(solicitud[key]);
            case 'id':
                return (
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/solicitud-interna?id=${solicitud.id}`}>
                            {solicitud.id}
                        </Link>
                    </Button>
                );
            case 'estado':
                return (
                     <Badge variant="outline">
                        {solicitud.estado}
                    </Badge>
                );
            case 'tiempoRestante':
                const value = isClosedTab ? solicitud.tiempoResolucion : solicitud.tiempoRestante;
                const variant = isClosedTab ? 'outline' : getTiempoRestanteVariant(solicitud.tiempoRestante);
                
                let text = value;
                if (!isClosedTab && value !== '-') {
                    if (variant === 'danger') {
                        text = `${value} (crítico)`;
                    } else if (variant === 'warning') {
                        text = `${value} (atención)`;
                    } else if (variant === 'success') {
                        text = `${value} (normal)`;
                    }
                }
                
                return <Badge variant={variant}>{text}</Badge>;
            case 'encuestaSatisfaccion':
                if (solicitud.encuestaSatisfaccion) {
                    return (
                        <div className="flex items-center gap-1">
                           <span>{solicitud.encuestaSatisfaccion}</span>
                           <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                    );
                }
                return '-';
            default:
                return solicitud[key as keyof Solicitud];
        }
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
                             <TableHead></TableHead>
                        </TableRow>
                        <TableRow>
                           {tableHeaders.map(header => (
                                <TableHead key={`${header.key}-filter`}>
                                  {header.key === 'tiempoRestante' && !isClosedTab ? (
                                    <Select
                                      value={filters.tiempoRestante || 'all'}
                                      onValueChange={(value) => handleSelectFilterChange(value, 'tiempoRestante')}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Filtrar por urgencia..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="danger">Crítico</SelectItem>
                                        <SelectItem value="warning">Atención</SelectItem>
                                        <SelectItem value="success">Normal</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : header.key === 'tipo' ? (
                                    <Select
                                      value={filters.tipo || 'all'}
                                      onValueChange={(value) => handleSelectFilterChange(value, 'tipo')}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Filtrar por tipo..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        {REQUEST_TYPES.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : header.key === 'estado' ? (
                                    <Select
                                      value={filters.estado || 'all'}
                                      onValueChange={(value) => handleSelectFilterChange(value, 'estado')}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Filtrar por estado..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        {(isClosedTab ? ['Respondida', 'Cancelada'] : ['Ingresada', 'En proceso']).map(estado => (
                                            <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : header.key === 'fechaEnvio' ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn("h-8 w-full justify-start text-left font-normal", !filters.fechaEnvio && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filters.fechaEnvio ? formatDate(filters.fechaEnvio) : <span>Filtrar...</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={filters.fechaEnvio ? parse(filters.fechaEnvio, 'yyyy-MM-dd', new Date()) : undefined}
                                                onSelect={(date) => handleDateFilterChange(date, 'fechaEnvio')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                  ) : (header.key !== 'encuestaSatisfaccion' &&
                                    <Input
                                        placeholder={`Filtrar...`}
                                        value={filters[header.key] || ''}
                                        onChange={(e) => handleFilterChange(e, header.key)}
                                        className="h-8"
                                    />
                                  )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentSolicitudes.length > 0 ? currentSolicitudes.map((solicitud) => (
                        <TableRow key={solicitud.id} className="text-xs">
                             {tableHeaders.map(header => (
                                <TableCell key={header.key} className="font-medium">
                                    {getCellValue(solicitud, header.key)}
                                </TableCell>
                            ))}
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
        mockSolicitudes.filter(s => ['Ingresada', 'En proceso'].includes(s.estado)), 
    []);

    const solicitudesCerradas = useMemo(() => 
        mockSolicitudes.filter(s => ['Respondida', 'Cancelada'].includes(s.estado)), 
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
                <Button asChild>
                    <Link href="/solicitud-interna">
                        <FilePenLine className="mr-2 h-4 w-4" />
                        Crear Solicitud
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
                    <SolicitudesTable solicitudes={solicitudesCerradas} isClosedTab={true} />
                </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
    );
}
