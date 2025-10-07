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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Save } from 'lucide-react';
import { type TipoSolicitudItem } from '@/lib/mock-data-maintainers';

const formSchema = z.object({
  value: z.string().min(2, 'El valor debe tener al menos 2 caracteres.'),
  tiempoMaximo: z.coerce.number().int().positive('Debe ser un número positivo.'),
  diasCritico: z.coerce.number().int().positive('Debe ser un número positivo.'),
  diasAtencion: z.coerce.number().int().positive('Debe ser un número positivo.'),
});

type FormValues = z.infer<typeof formSchema>;

interface TiposSolicitudDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TipoSolicitudItem | null;
  onSave: (data: FormValues, id: string | null) => void;
}

export function TiposSolicitudDialog({ open, onOpenChange, item, onSave }: TiposSolicitudDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
      tiempoMaximo: 0,
      diasCritico: 0,
      diasAtencion: 0,
    },
  });

  useEffect(() => {
    if (open) {
        if (item) {
            form.reset(item);
        } else {
            form.reset({
                value: '',
                tiempoMaximo: 20,
                diasCritico: 5,
                diasAtencion: 10,
            });
        }
    }
  }, [item, form, open]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(values, item?.id ?? null);
      setIsSubmitting(false);
      onOpenChange(false);
      toast({
        title: item ? 'Tipo Actualizado' : 'Tipo Creado',
        description: `El tipo de solicitud "${values.value}" ha sido guardado con éxito.`,
      });
    }, 500);
  };
  
  const dialogTitle = item ? 'Editar Tipo de Solicitud' : 'Crear Nuevo Tipo de Solicitud';
  const buttonText = item ? 'Actualizar' : 'Crear';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
          <DialogDescription>
            {item ? 'Edite los detalles del tipo de solicitud.' : 'Cree un nuevo tipo de solicitud y configure sus tiempos.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Tipo de Solicitud</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Consulta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="tiempoMaximo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tiempo Máx. (días)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="diasCritico"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Días Crítico</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="diasAtencion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Días Atención</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
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
