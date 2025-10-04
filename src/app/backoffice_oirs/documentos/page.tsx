'use client';
import { useState, useMemo, ChangeEvent } from 'react';
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
import { ArrowUpDown, Edit, FileUp, Files, Trash2 } from 'lucide-react';
import { mockDocuments, type Documento } from '@/lib/mock-data-docs';
import { Icons } from '@/components/icons';
import { DocumentDialog } from './document-dialog';
import { ConfirmDialog } from '@/components/confirm-dialog';

type SortConfig = {
  key: keyof Documento;
  direction: 'ascending' | 'descending';
} | null;

const getDocumentIcon = (type: Documento['tipo']) => {
  const Icon = Icons[type];
  return Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : <FileText className="h-5 w-5 text-muted-foreground" />;
};

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};

export default function DocumentosPage() {
    const [documentos, setDocumentos] = useState<Documento[]>(mockDocuments);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fechaCarga', direction: 'descending' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Documento | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const requestSort = (key: keyof Documento) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const handleOpenDialog = (doc: Documento | null = null) => {
      setEditingDocument(doc);
      setIsDialogOpen(true);
    };
    
    const handleSaveDocument = (data: { nombre: string; descripcion: string; archivo?: File }) => {
      setDocumentos(prev => {
        if (editingDocument) {
          // Edit existing
          return prev.map(doc => doc.id === editingDocument.id ? { ...doc, nombre: data.nombre, descripcion: data.descripcion } : doc);
        } else {
          // Add new
          const newDoc: Documento = {
            id: `doc-${Date.now()}`,
            nombre: data.nombre,
            descripcion: data.descripcion,
            fechaCarga: new Date().toISOString().split('T')[0],
            tipo: data.archivo?.type.startsWith('image/') ? 'FileImage' : data.archivo?.type.startsWith('audio/') ? 'FileAudio' : 'FileText',
          };
          return [newDoc, ...prev];
        }
      });
    };
    
    const openDeleteConfirm = (id: string) => {
        setDeletingDocumentId(id);
        setIsConfirmOpen(true);
    };
    
    const handleDeleteDocument = () => {
        if (deletingDocumentId) {
            setDocumentos(prev => prev.filter(doc => doc.id !== deletingDocumentId));
        }
    };

    const filteredDocuments = useMemo(() => {
        let filtered = [...documentos];

        if (searchQuery) {
            filtered = filtered.filter(doc => 
                doc.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                doc.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
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
    }, [searchQuery, sortConfig, documentos]);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                    <CardTitle className="flex items-center gap-2">
                        <Files />
                        <span>Gestión de Documentos</span>
                    </CardTitle>
                    <CardDescription>
                        Administre los documentos disponibles para descarga en el sistema.
                    </CardDescription>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Cargar Documento
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input
                            placeholder="Buscar por nombre o descripción..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="max-w-sm"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Nombre del Documento</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => requestSort('fechaCarga')}>
                                            Fecha de Carga
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{getDocumentIcon(doc.tipo)}</TableCell>
                                    <TableCell className="font-medium">{doc.nombre}</TableCell>
                                    <TableCell className="text-muted-foreground">{doc.descripcion}</TableCell>
                                    <TableCell>{formatDate(doc.fechaCarga)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(doc)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Editar</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDeleteConfirm(doc.id)}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Eliminar</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No se encontraron documentos.
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <DocumentDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                documento={editingDocument}
                onSave={handleSaveDocument}
            />
             <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onConfirm={handleDeleteDocument}
                title="¿Eliminar Documento?"
                description="Esta acción es irreversible y eliminará el documento permanentemente. ¿Está seguro de que desea continuar?"
                confirmText="Sí, eliminar"
            />
        </>
    );
}