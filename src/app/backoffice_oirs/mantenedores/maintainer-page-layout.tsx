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
import { ArrowUpDown, Edit, PlusCircle, Trash2, Database } from 'lucide-react';
import { MaintainerDialog } from './maintainer-dialog';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { type MaintainerItem } from '@/lib/mock-data-maintainers';

interface MaintainerPageLayoutProps {
  title: string;
  description: string;
  initialData: MaintainerItem[];
  columns: { accessorKey: string; header: string }[];
  dataType: string;
}

export default function MaintainerPageLayout({
  title,
  description,
  initialData,
  columns: propColumns,
  dataType,
}: MaintainerPageLayoutProps) {
  const [data, setData] = useState<MaintainerItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaintainerItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleSaveItem = (values: { value: string }, id: string | null) => {
    setData(prev => {
      if (id) { // Editing
        return prev.map(item => item.id === id ? { ...item, value: values.value } : item);
      } else { // Creating
        const newItem: MaintainerItem = {
          id: `${dataType}-${Date.now()}`,
          value: values.value,
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleOpenDialog = (item: MaintainerItem | null = null) => {
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

  const tableColumns = useMemo<ColumnDef<MaintainerItem>[]>(() => [
    ...propColumns.map(col => ({
      accessorKey: col.accessorKey,
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {col.header}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    })),
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
  ], [propColumns]);
  
  const table = useReactTable({
    data,
    columns: tableColumns,
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
              <Database />
              <span>{title}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar..."
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
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length} className="h-24 text-center">
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
      <MaintainerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
        title={title}
        description={editingItem ? `Edite el valor del elemento.` : `Cree un nuevo elemento para ${title}.`}
        label={propColumns[0].header}
      />
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteItem}
        title="¿Eliminar Elemento?"
        description="Esta acción es irreversible y eliminará el elemento permanentemente. ¿Está seguro de que desea continuar?"
        confirmText="Sí, eliminar"
      />
    </>
  );
}
