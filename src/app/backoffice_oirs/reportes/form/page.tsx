'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, FilePlus } from 'lucide-react';
import { Icons } from '@/components/icons';
import { mockReports, type Reporte } from '@/lib/mock-data-reports';

const formSchema = z.object({
  nombre: z.string().min(3, 'El nombre es obligatorio.'),
  descripcion: z.string().min(10, 'La descripción es obligatoria.'),
  tipo: z.enum(['Tabla', 'Dashboard'], { required_error: 'Debe seleccionar un tipo de reporte' }),
});

type FormValues = z.infer<typeof formSchema>;

const ReportFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const reportId = searchParams.get('id');
  const [mode, setMode] = useState<'create' | 'edit'>(reportId ? 'edit' : 'create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      tipo: undefined,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && reportId) {
      const reportToEdit = mockReports.find(r => r.id === reportId);
      if (reportToEdit) {
        form.reset(reportToEdit);
      } else {
        toast({
          title: 'Error',
          description: 'Reporte no encontrado.',
          variant: 'destructive',
        });
        router.push('/backoffice_oirs/reportes');
      }
    }
  }, [mode, reportId, form, toast, router]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === 'create') {
        console.log('Creating report:', values);
        toast({ title: 'Éxito', description: 'Reporte creado correctamente.' });
      } else {
        console.log('Updating report:', values);
        toast({ title: 'Éxito', description: 'Reporte actualizado correctamente.' });
      }
      setIsSubmitting(false);
      router.push('/backoffice_oirs/reportes');
    }, 1000);
  };

  const pageTitle = mode === 'create' ? 'Crear Nuevo Reporte' : 'Editar Reporte';
  const pageDescription = mode === 'create'
    ? 'Complete el formulario para agregar un nuevo reporte.'
    : 'Modifique los datos del reporte seleccionado.';
  const buttonText = mode === 'create' ? 'Crear Reporte' : 'Actualizar Reporte';
  const ButtonIcon = mode === 'create' ? FilePlus : Save;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/backoffice_oirs/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la grilla
          </Link>
        </Button>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Reporte</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Reporte mensual de solicitudes" {...field} />
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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describa el propósito y contenido del reporte..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Reporte</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Tabla">Tabla</SelectItem>
                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <div className="p-6 pt-0 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Icons.Loading className="mr-2" /> : <ButtonIcon className="mr-2" />}
                {buttonText}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};


export default function ReportFormPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ReportFormContent />
        </Suspense>
    )
}
