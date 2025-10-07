
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
import { HelpCircle, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { mockFaqs, type FaqItem } from '@/lib/mock-data-faq';
import { ConfirmDialog } from '@/components/confirm-dialog';

export default function FaqPage() {
    const [faqs, setFaqs] = useState<FaqItem[]>(mockFaqs);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);
    
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const openDeleteConfirm = (id: string) => {
        setDeletingFaqId(id);
        setIsConfirmOpen(true);
    };
    
    const handleDeleteFaq = () => {
        if (deletingFaqId) {
            setFaqs(prev => prev.filter(faq => faq.id !== deletingFaqId));
        }
    };
    
    const filteredFaqs = useMemo(() => {
        if (!searchQuery) return faqs;
        return faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [faqs, searchQuery]);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle />
                            <span>Gestión de Preguntas Frecuentes</span>
                        </CardTitle>
                        <CardDescription>
                            Administre las preguntas y respuestas que se muestran en el portal público.
                        </CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/backoffice_oirs/mantenedores/preguntas-frecuentes/form">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Pregunta
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input
                            placeholder="Buscar por pregunta o respuesta..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="max-w-sm"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Pregunta</TableHead>
                                    <TableHead>Respuesta</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
                                    <TableRow key={faq.id}>
                                        <TableCell className="font-medium">{faq.question}</TableCell>
                                        <TableCell className="text-muted-foreground truncate max-w-sm">{faq.answer}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/backoffice_oirs/mantenedores/preguntas-frecuentes/form?id=${faq.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Editar</span>
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDeleteConfirm(faq.id)}>
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Eliminar</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No se encontraron preguntas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onConfirm={handleDeleteFaq}
                title="¿Eliminar Pregunta?"
                description="Esta acción es irreversible. ¿Está seguro de que desea eliminar esta pregunta frecuente?"
                confirmText="Sí, eliminar"
            />
        </>
    );
}
