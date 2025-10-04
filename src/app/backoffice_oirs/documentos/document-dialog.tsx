'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { type Documento } from '@/lib/mock-data-docs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const formSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  archivo: z.instanceof(File).optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 10MB.`)
});

type FormValues = z.infer<typeof formSchema>;

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documento?: Documento | null;
  onSave: (data: FormValues) => void;
}

export function DocumentDialog({ open, onOpenChange, documento, onSave }: DocumentDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      archivo: undefined,
    },
  });

  useEffect(() => {
    if (documento) {
      form.reset({
        nombre: documento.nombre,
        descripcion: documento.descripcion,
        archivo: undefined, // No pre-cargamos el archivo, solo se pide si se quiere reemplazar
      });
    } else {
      form.reset({
        nombre: '',
        descripcion: '',
        archivo: undefined,
      });
    }
  }, [documento, form, open]);

  const onSubmit = (values: FormValues) => {
    if (!documento && !values.archivo) {
      form.setError('archivo', { message: 'Debe seleccionar un archivo para cargar.' });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSave(values);
      setIsSubmitting(false);
      onOpenChange(false);
      toast({
        title: documento ? 'Documento Actualizado' : 'Documento Cargado',
        description: `El documento "${values.nombre}" ha sido guardado con éxito.`,
      });
    }, 1000);
  };
  
  const dialogTitle = documento ? 'Editar Documento' : 'Cargar Nuevo Documento';
  const dialogDescription = documento ? 'Modifique los detalles del documento.' : 'Complete el formulario para cargar un nuevo documento al sistema.';
  const buttonText = documento ? 'Actualizar Documento' : 'Guardar Documento';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Manual de procedimientos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Breve</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describa el contenido o propósito del documento..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="archivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{documento ? 'Reemplazar Archivo (Opcional)' : 'Archivo'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    {documento ? `Archivo actual: ${documento.nombre}` : 'Seleccione el archivo a cargar. Límite: 10MB.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Icons.Loading className="mr-2" /> : <Save className="mr-2" />}
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}