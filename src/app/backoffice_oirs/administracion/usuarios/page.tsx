
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
import { ArrowUpDown, Edit, UserPlus, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type User = {
    id: string;
    rut: string;
    nombre: string;
    email: string;
    oficina: string;
    estado: 'Activo' | 'Inactivo';
    perfil: 'Administrador' | 'Encargado OIRS' | 'Funcionario';
}

const mockUsers: User[] = [
    { id: '1', rut: '12.345.678-9', nombre: 'Ana Contreras', email: 'ana.contreras@sernameg.gob.cl', oficina: 'Metropolitana de Santiago', estado: 'Activo', perfil: 'Administrador' },
    { id: '2', rut: '11.478.406-0', nombre: 'Juan Soto', email: 'juan.soto@sernameg.gob.cl', oficina: 'Valparaíso', estado: 'Activo', perfil: 'Encargado OIRS' },
    { id: '3', rut: '10.987.654-3', nombre: 'María González', email: 'maria.gonzalez@sernameg.gob.cl', oficina: 'Biobío', estado: 'Inactivo', perfil: 'Funcionario' },
    { id: '4', rut: '13.456.789-K', nombre: 'Carlos López', email: 'carlos.lopez@sernameg.gob.cl', oficina: 'La Araucanía', estado: 'Activo', perfil: 'Funcionario' },
    { id: '5', rut: '14.567.890-1', nombre: 'Luisa Martinez', email: 'luisa.martinez@sernameg.gob.cl', oficina: 'Los Lagos', estado: 'Activo', perfil: 'Encargado OIRS' },
];

type SortConfig = {
  key: keyof User;
  direction: 'ascending' | 'descending';
} | null;

const getStatusVariant = (estado: string) => {
  if (estado === 'Activo') return 'default';
  return 'destructive';
};

const UserTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState<Partial<Record<keyof User, string>>>({});
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nombre', direction: 'ascending' });

    const tableHeaders: { key: keyof User, label: string, sortable: boolean }[] = [
        { key: 'rut', label: 'RUT', sortable: true },
        { key: 'nombre', label: 'Nombre', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'oficina', label: 'Oficina Regional', sortable: false },
        { key: 'perfil', label: 'Perfil', sortable: false },
        { key: 'estado', label: 'Estado', sortable: false },
    ];

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>, key: keyof User) => {
        setFilters(prev => ({...prev, [key]: e.target.value }));
        setCurrentPage(1);
    };

    const requestSort = (key: keyof User) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredUsers = useMemo(() => {
        let filtered = [...mockUsers];

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                filtered = filtered.filter(user => {
                    const userValue = user[key as keyof User];
                    return userValue?.toString().toLowerCase().includes(value.toLowerCase());
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

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
    
    const getCellValue = (user: User, key: keyof User) => {
        switch (key) {
            case 'estado':
                return (
                     <Badge variant={getStatusVariant(user.estado)}>
                        {user.estado}
                    </Badge>
                );
            default:
                return user[key as keyof User];
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
                             <TableHead>Acciones</TableHead>
                        </TableRow>
                        <TableRow>
                            {tableHeaders.map(header => (
                                <TableHead key={`${header.key}-filter`}>
                                    <Input
                                        placeholder={`Filtrar ${header.label}...`}
                                        value={filters[header.key] || ''}
                                        onChange={(e) => handleFilterChange(e, header.key)}
                                        className="h-8"
                                    />
                                </TableHead>
                            ))}
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentUsers.length > 0 ? currentUsers.map((user) => (
                        <TableRow key={user.id} className="text-xs">
                            {tableHeaders.map(header => (
                                <TableCell key={header.key} className="font-medium">
                                    {getCellValue(user, header.key)}
                                </TableCell>
                            ))}
                            <TableCell>
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length + 1} className="h-24 text-center">
                                No se encontraron usuarios.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between w-full items-center">
                <div className="text-xs text-muted-foreground">
                    Mostrando {Math.min(itemsPerPage, currentUsers.length)} de {filteredUsers.length} usuarios.
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

export default function AdministracionUsuariosPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users />
            <span>Gestión de Usuarios</span>
          </CardTitle>
          <CardDescription>
            Administre los usuarios internos del sistema OIRS.
          </CardDescription>
        </div>
        <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Crear Usuario
        </Button>
      </CardHeader>
      <CardContent>
        <UserTable />
      </CardContent>
    </Card>
  );
}
