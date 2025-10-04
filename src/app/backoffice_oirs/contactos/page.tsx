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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowUpDown, Edit, UserPlus, BookUser } from 'lucide-react';
import { mockContacts, type Contacto } from '@/lib/mock-data-contacts';


type SortConfig = {
  key: keyof Contacto;
  direction: 'ascending' | 'descending';
} | null;


const ContactosTable = () => {
    const [filters, setFilters] = useState<Partial<Record<keyof Contacto, string>>>({});
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nombre', direction: 'ascending' });

    const tableHeaders: { key: keyof Contacto, label: string, sortable: boolean }[] = [
        { key: 'region', label: 'Región', sortable: true },
        { key: 'nombre', label: 'Nombre', sortable: true },
        { key: 'cargo', label: 'Rol o Cargo', sortable: true },
        { key: 'institucion', label: 'Institución', sortable: true },
    ];

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>, key: keyof Contacto) => {
        setFilters(prev => ({...prev, [key]: e.target.value }));
    };

    const requestSort = (key: keyof Contacto) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredContacts = useMemo(() => {
        let filtered = [...mockContacts];

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                filtered = filtered.filter(contact => {
                    const contactValue = contact[key as keyof Contacto];
                    return contactValue?.toString().toLowerCase().includes(value.toLowerCase());
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
                    {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
                        <TableRow key={contact.id} className="text-sm">
                            {tableHeaders.map(header => (
                                <TableCell key={header.key} className="font-medium">
                                    {contact[header.key]}
                                </TableCell>
                            ))}
                            <TableCell>
                                <Button variant="ghost" size="icon" asChild>
                                   <Link href={`/backoffice_oirs/contactos/form?id=${contact.id}`}>
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length + 1} className="h-24 text-center">
                                No se encontraron contactos.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
             <div className="text-xs text-muted-foreground">
                Total de {filteredContacts.length} contactos.
            </div>
        </div>
    );
};

export default function AdministracionContactosPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookUser />
            <span>Gestión de Contactos</span>
          </CardTitle>
          <CardDescription>
            Administre la red de contactos intersectoriales.
          </CardDescription>
        </div>
        <Button asChild>
            <Link href="/backoffice_oirs/contactos/form">
                <UserPlus className="mr-2 h-4 w-4" />
                Crear Contacto
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ContactosTable />
      </CardContent>
    </Card>
  );
}
