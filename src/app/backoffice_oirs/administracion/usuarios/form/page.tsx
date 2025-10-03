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
import { mockUsers, type User } from '@/lib/mock-data';
import { REGIONES_CHILE } from '@/lib/constants';

const formSchema = z.object({
  rut: z.string().min(1, 'RUT es obligatorio'),
  nombre: z.string().min(1, 'Nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  oficina: z.enum(REGIONES_CHILE, { required_error: 'Debe seleccionar una oficina' }),
  perfil: z.enum(['Administrador', 'Encargado OIRS Regional', 'Encargado OIRS Nacional'], { required_error: 'Debe seleccionar un perfil' }),
  estado: z.enum(['Activo', 'Inactivo'], { required_error: 'Debe seleccionar un estado' }),
});

type FormValues = z.infer<typeof formSchema>;

const UserFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const userId = searchParams.get('id');
  const [mode, setMode] = useState<'create' | 'edit'>(userId ? 'edit' : 'create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: '',
      nombre: '',
      email: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && userId) {
      const userToEdit = mockUsers.find(u => u.id === userId);
      if (userToEdit) {
        form.reset(userToEdit);
      } else {
        toast({
          title: 'Error',
          description: 'Usuario no encontrado.',
          variant: 'destructive',
        });
        router.push('/backoffice_oirs/administracion/usuarios');
      }
    }
  }, [mode, userId, form, toast, router]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (mode === 'create') {
        console.log('Creating user:', values);
        toast({ title: 'Éxito', description: 'Usuario creado correctamente.' });
      } else {
        console.log('Updating user:', values);
        toast({ title: 'Éxito', description: 'Usuario actualizado correctamente.' });
      }
      setIsSubmitting(false);
      router.push('/backoffice_oirs/administracion/usuarios');
    }, 1000);
  };

  const pageTitle = mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario';
  const pageDescription = mode === 'create'
    ? 'Complete el formulario para agregar un nuevo usuario al sistema.'
    : 'Modifique los datos del usuario seleccionado.';
  const buttonText = mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario';
  const ButtonIcon = mode === 'create' ? UserPlus : Save;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/backoffice_oirs/administracion/usuarios">
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
                name="rut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUT</FormLabel>
                    <FormControl>
                      <Input placeholder="12.345.678-9" {...field} />
                    </FormControl>
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
                      <Input placeholder="Nombre del usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="usuario@sernameg.gob.cl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oficina"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oficina Regional</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una oficina" />
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
                name="perfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Administrador', 'Encargado OIRS Regional', 'Encargado OIRS Nacional'].map(perfil => (
                          <SelectItem key={perfil} value={perfil}>{perfil}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
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


export default function UserFormPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <UserFormContent />
        </Suspense>
    )
}
