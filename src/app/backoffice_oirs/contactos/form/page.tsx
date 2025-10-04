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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { Icons } from '@/components/icons';
import { mockContacts, type Contacto } from '@/lib/mock-data-contacts';
import { REGIONES_CHILE } from '@/lib/constants';

const formSchema = z.object({
  region: z.enum(REGIONES_CHILE, { required_error: 'Debe seleccionar una región' }),
  nombre: z.string().min(1, 'Nombre es obligatorio'),
  cargo: z.string().min(1, 'El cargo es obligatorio'),
  institucion: z.string().min(1, 'La institución es obligatoria'),
});

type FormValues = z.infer<typeof formSchema>;

const ContactFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const contactId = searchParams.get('id');
  const [mode, setMode] = useState<'create' | 'edit'>(contactId ? 'edit' : 'create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: undefined,
      nombre: '',
      cargo: '',
      institucion: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && contactId) {
      const contactToEdit = mockContacts.find(c => c.id === contactId);
      if (contactToEdit) {
        form.reset(contactToEdit);
      } else {
        toast({
          title: 'Error',
          description: 'Contacto no encontrado.',
          variant: 'destructive',
        });
        router.push('/backoffice_oirs/contactos');
      }
    }
  }, [mode, contactId, form, toast, router]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (mode === 'create') {
        console.log('Creating contact:', values);
        toast({ title: 'Éxito', description: 'Contacto creado correctamente.' });
      } else {
        console.log('Updating contact:', values);
        toast({ title: 'Éxito', description: 'Contacto actualizado correctamente.' });
      }
      setIsSubmitting(false);
      router.push('/backoffice_oirs/contactos');
    }, 1000);
  };

  const pageTitle = mode === 'create' ? 'Crear Nuevo Contacto' : 'Editar Contacto';
  const pageDescription = mode === 'create'
    ? 'Complete el formulario para agregar un nuevo contacto.'
    : 'Modifique los datos del contacto seleccionado.';
  const buttonText = mode === 'create' ? 'Crear Contacto' : 'Actualizar Contacto';
  const ButtonIcon = mode === 'create' ? UserPlus : Save;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/backoffice_oirs/contactos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la grilla
          </Link>
        </Button>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Región</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una región" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REGIONES_CHILE.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol o Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Encargada de Oficina de Partes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institucion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institución</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Municipalidad de..." {...field} />
                    </FormControl>
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


export default function ContactFormPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ContactFormContent />
        </Suspense>
    )
}
