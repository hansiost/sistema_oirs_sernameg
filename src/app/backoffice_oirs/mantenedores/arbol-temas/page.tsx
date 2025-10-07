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
import { ArrowUpDown, Edit, PlusCircle, Trash2, Network } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { mockMaintainers, type TemaItem } from '@/lib/mock-data-maintainers';
import { ArbolTemasDialog } from './arbol-temas-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REQUEST_TYPES } from '@/lib/constants';

export default function ArbolTemasPage() {
  const [data, setData] = useState<TemaItem[]>(mockMaintainers.arbolTemas);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<any>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TemaItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleSaveItem = (values: Omit<TemaItem, 'id'>, id: string | null) => {
    setData(prev => {
      if (id) {
        return prev.map(item => item.id === id ? { ...values, id } : item);
      } else {
        const newItem: TemaItem = {
          id: `at-${Date.now()}`,
          ...values,
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleOpenDialog = (item: TemaItem | null = null) => {
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

  const columns = useMemo<ColumnDef<TemaItem>[]>(() => [
    {
      accessorKey: 'value',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Tema
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'requestType',
      header: 'Tipo de Solicitud',
      cell: ({ row }) => row.original.requestType,
      filterFn: 'equals',
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
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network />
              <span>Árbol de Temas</span>
            </CardTitle>
            <CardDescription>Gestione los temas y subtemas de las solicitudes y su categoría.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Tema
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Buscar por nombre de tema..."
              value={globalFilter}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={table.getColumn('requestType')?.getFilterValue() as string ?? ''}
              onValueChange={(value) => table.getColumn('requestType')?.setFilterValue(value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filtrar por tipo de solicitud..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                {REQUEST_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      <ArbolTemasDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
      />
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteItem}
        title="¿Eliminar Tema?"
        description="Esta acción es irreversible y eliminará el tema permanentemente. ¿Está seguro de que desea continuar?"
        confirmText="Sí, eliminar"
      />
    </>
  );
}
