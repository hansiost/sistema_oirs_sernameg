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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Edit, BarChart3, FilePlus } from 'lucide-react';
import { mockReports, type Reporte } from '@/lib/mock-data-reports';

type SortConfig = {
  key: keyof Reporte;
  direction: 'ascending' | 'descending';
} | null;

const getTypeVariant = (type: string) => {
  if (type === 'Dashboard') return 'default';
  return 'secondary';
};

const ReportesTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nombre', direction: 'ascending' });

    const tableHeaders: { key: keyof Reporte, label: string, sortable: boolean }[] = [
        { key: 'id', label: 'ID Reporte', sortable: true },
        { key: 'nombre', label: 'Nombre', sortable: true },
        { key: 'descripcion', label: 'Descripción', sortable: false },
        { key: 'tipo', label: 'Tipo', sortable: true },
    ];

    const requestSort = (key: keyof Reporte) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredReports = useMemo(() => {
        let filtered = [...mockReports];

        if (searchQuery) {
            filtered = filtered.filter(report => 
                report.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                report.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const key = sortConfig.key as keyof Reporte;
                if (a[key]! < b[key]!) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[key]! > b[key]!) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [searchQuery, sortConfig]);

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <Input
                    placeholder="Buscar por nombre o descripción..."
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
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
                             <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredReports.length > 0 ? filteredReports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell className="font-mono text-xs">
                               <Button variant="link" asChild className="p-0 h-auto font-mono">
                                    <Link href={report.link || `/backoffice_oirs/reportes/view?id=${report.id}`} target={report.link ? '_blank' : '_self'}>
                                        {report.id}
                                    </Link>
                                </Button>
                            </TableCell>
                            <TableCell className="font-medium">{report.nombre}</TableCell>
                            <TableCell className="text-muted-foreground">{report.descripcion}</TableCell>
                            <TableCell>
                                <Badge variant={getTypeVariant(report.tipo)}>
                                    {report.tipo}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                   <Link href={`/backoffice_oirs/reportes/form?id=${report.id}`}>
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length + 1} className="h-24 text-center">
                                No se encontraron reportes.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
             <div className="text-xs text-muted-foreground">
                Total de {filteredReports.length} reportes.
            </div>
        </div>
    );
};

export default function ReportesPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 />
            <span>Gestión de Reportes</span>
          </CardTitle>
          <CardDescription>
            Administre los reportes y dashboards del sistema.
          </CardDescription>
        </div>
        <Button asChild>
            <Link href="/backoffice_oirs/reportes/form">
                <FilePlus className="mr-2 h-4 w-4" />
                Nuevo Reporte
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ReportesTable />
      </CardContent>
    </Card>
  );
}
