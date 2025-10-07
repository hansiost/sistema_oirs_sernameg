'use client';
import { useState, useMemo, ChangeEvent } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
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
import { ArrowUpDown, Edit, PlusCircle, Trash2, FileText } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { mockMaintainers, type TipoSolicitudItem } from '@/lib/mock-data-maintainers';
import { TiposSolicitudDialog } from './tipos-solicitud-dialog';

export default function TiposSolicitudPage() {
  const [data, setData] = useState<TipoSolicitudItem[]>(mockMaintainers.tiposSolicitud);
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoSolicitudItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleSaveItem = (values: Omit<TipoSolicitudItem, 'id'>, id: string | null) => {
    setData(prev => {
      if (id) { // Editing
        return prev.map(item => item.id === id ? { ...values, id } : item);
      } else { // Creating
        const newItem: TipoSolicitudItem = {
          id: `ts-${Date.now()}`,
          ...values,
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleOpenDialog = (item: TipoSolicitudItem | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setDeletingItemId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteItem = () => {
    if (deletingItemId) {
      setData(prev => prev.filter(item => item.id !== deletingItemId));
    }
  };

  const columns = useMemo<ColumnDef<TipoSolicitudItem>[]>(() => [
    {
      accessorKey: 'value',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Tipo de Solicitud
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'tiempoMaximo',
      header: 'Tiempo Máx. Resolución (días)',
    },
    {
      accessorKey: 'diasCritico',
      header: 'N° días Crítico',
    },
    {
      accessorKey: 'diasAtencion',
      header: 'N° días Atención',
    },
    {
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-right">
            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDeleteConfirm(item.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setSearchQuery,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: searchQuery,
    },
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText />
              <span>Tipos de Solicitud</span>
            </CardTitle>
            <CardDescription>Administre los tipos de solicitud y sus tiempos de gestión.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Tipo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por tipo de solicitud..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-xs text-muted-foreground pt-4">
            Total de {table.getFilteredRowModel().rows.length} registros.
          </div>
        </CardContent>
      </Card>
      <TiposSolicitudDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
      />
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteItem}
        title="¿Eliminar Tipo de Solicitud?"
        description="Esta acción es irreversible y eliminará el tipo de solicitud permanentemente. ¿Está seguro de que desea continuar?"
        confirmText="Sí, eliminar"
      />
    </>
  );
}
