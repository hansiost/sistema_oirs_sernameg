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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { type TemaItem } from '@/lib/mock-data-maintainers';
import { REQUEST_TYPES } from '@/lib/constants';

const formSchema = z.object({
  value: z.string().min(2, 'El nombre del tema debe tener al menos 2 caracteres.'),
  requestType: z.enum(REQUEST_TYPES, { required_error: 'Debe seleccionar un tipo de solicitud.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ArbolTemasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TemaItem | null;
  onSave: (data: FormValues, id: string | null) => void;
}

export function ArbolTemasDialog({ open, onOpenChange, item, onSave }: ArbolTemasDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: '', requestType: undefined },
  });

  useEffect(() => {
    if (open) {
      if (item) {
        form.reset(item);
      } else {
        form.reset({ value: '', requestType: undefined });
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
        title: item ? 'Tema Actualizado' : 'Tema Creado',
        description: `El tema "${values.value}" ha sido guardado con éxito.`,
      });
    }, 500);
  };
  
  const dialogTitle = item ? 'Editar Tema' : 'Crear Nuevo Tema';
  const buttonText = item ? 'Actualizar' : 'Crear';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
          <DialogDescription>
            {item ? 'Edite el nombre del tema y su tipo de solicitud asociado.' : 'Cree un nuevo tema y asígnelo a un tipo de solicitud.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Solicitud</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo de solicitud" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REQUEST_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Tema</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Derechos de la mujer" {...field} />
                  </FormControl>
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
