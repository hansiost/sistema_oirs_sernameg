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
import { type MaintainerItem } from '@/lib/mock-data-maintainers';

const formSchema = z.object({
  value: z.string().min(2, 'El valor debe tener al menos 2 caracteres.'),
});

type FormValues = z.infer<typeof formSchema>;

interface MaintainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MaintainerItem | null;
  onSave: (data: FormValues, id: string | null) => void;
  title: string;
  description: string;
  label: string;
}

export function MaintainerDialog({ open, onOpenChange, item, onSave, title, description, label }: MaintainerDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: '' },
  });

  useEffect(() => {
    if (item) {
      form.reset({ value: item.value });
    } else {
      form.reset({ value: '' });
    }
  }, [item, form, open]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(values, item?.id ?? null);
      setIsSubmitting(false);
      onOpenChange(false);
      toast({
        title: item ? 'Elemento Actualizado' : 'Elemento Creado',
        description: `El elemento "${values.value}" ha sido guardado con éxito.`,
      });
    }, 500);
  };
  
  const dialogTitle = item ? `Editar ${title}` : `Crear Nuevo ${title}`;
  const buttonText = item ? 'Actualizar' : 'Crear';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Ej: ${label}...`} {...field} />
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
