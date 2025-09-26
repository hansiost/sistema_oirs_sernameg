'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { submitRegistro } from './actions';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- Validation Schemas ---

// Simple RUT validation for format, not for validity of the digit.
const rutSchema = z
  .string()
  .min(8, 'El RUT debe tener al menos 8 caracteres.')
  .regex(
    /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]$/,
    'Formato de RUT no válido (ej: 12.345.678-9).'
  );

const formSchema = z.object({
  rut: rutSchema,
  nombres: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  calle: z.string().min(3, 'La calle es obligatoria.'),
  numero: z.string().min(1, 'El número es obligatorio.'),
  comuna: z.string().min(3, 'La comuna es obligatoria.'),
  region: z.string().min(3, 'La región es obligatoria.'),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos.'),
  email: z.string().email('El e-mail no es válido.'),
});

type FormValues = z.infer<typeof formSchema>;

// --- Mock Data ---

const mockUserApi = (rut: string) => {
  // Simulate API call delay
  return new Promise<{
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  } | null>((resolve) => {
    setTimeout(() => {
      if (rut.startsWith('12.345.678')) {
        resolve({
          nombres: 'Juana Andrea',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'González',
        });
      } else {
        resolve(null);
      }
    }, 1000);
  });
};

// --- Component ---

export default function RegistroForm() {
  const { toast } = useToast();
  const [isVerifying, startVerifyingTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [userFound, setUserFound] = useState(false);
  const [rutInput, setRutInput] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      calle: '',
      numero: '',
      comuna: '',
      region: '',
      telefono: '',
      email: '',
    },
  });

  const handleVerificarRut = () => {
    const result = rutSchema.safeParse(rutInput);
    if (!result.success) {
      form.setError('rut', {
        type: 'manual',
        message: result.error.flatten().fieldErrors.rut?.[0] || 'RUT inválido.',
      });
      return;
    }
    form.clearErrors('rut');

    startVerifyingTransition(async () => {
      const userData = await mockUserApi(result.data);
      if (userData) {
        form.setValue('rut', result.data);
        form.setValue('nombres', userData.nombres);
        form.setValue('apellidoPaterno', userData.apellidoPaterno);
        form.setValue('apellidoMaterno', userData.apellidoMaterno);
        setUserFound(true);
        toast({
          title: 'Usuario Encontrado',
          description: 'Sus datos personales han sido cargados. Por favor, complete su información de contacto.',
        });
      } else {
        toast({
          title: 'Usuario No Encontrado',
          description: 'No se encontró un usuario con el RUT proporcionado. Intente con "12.345.678-9".',
          variant: 'destructive',
        });
        setUserFound(false);
      }
    });
  };

  const onSubmit = (values: FormValues) => {
    startSubmitTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
      
      const result = await submitRegistro(null, formData);

      if (result.error) {
        toast({
          title: 'Error en el Registro',
          description: result.error,
          variant: 'destructive',
        });
      }
      if (result.message) {
        toast({
          title: 'Registro Exitoso',
          description: result.message,
        });
        form.reset();
        setRutInput('');
        setUserFound(false);
      }
    });
  };
  
  const formError = form.formState.errors.rut;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Verificación de Identidad</CardTitle>
            <CardDescription>
              Ingrese su RUT para validar su identidad y cargar sus datos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-full sm:w-auto flex-grow space-y-2">
                <Label htmlFor="rut">RUT *</Label>
                <Input
                  id="rut"
                  placeholder="12.345.678-9"
                  value={rutInput}
                  onChange={(e) => setRutInput(e.target.value)}
                  disabled={isVerifying || userFound}
                  className={formError ? 'border-destructive' : ''}
                />
                 {formError && <p className="text-sm font-medium text-destructive">{formError.message}</p>}
                 {!formError && <FormDescription>Para la simulación, use el RUT 12.345.678-9.</FormDescription>}
              </div>
              <div className='pt-2 sm:pt-8'>
                <Button
                  type="button"
                  onClick={handleVerificarRut}
                  disabled={isVerifying || userFound || !rutInput}
                >
                  {isVerifying ? (
                    <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.Login className="mr-2 h-4 w-4" />
                  )}
                  Verificar RUT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {userFound && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>2. Datos Personales</CardTitle>
                <CardDescription>
                  Esta información es obtenida del Registro Civil y no puede ser modificada.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>RUT</Label>
                  <Input {...form.register('rut')} disabled />
                </div>
                <div className="space-y-1">
                  <Label>Nombres</Label>
                  <Input {...form.register('nombres')} disabled />
                </div>
                <div className="space-y-1">
                  <Label>Apellido Paterno</Label>
                  <Input {...form.register('apellidoPaterno')} disabled />
                </div>
                <div className="space-y-1">
                  <Label>Apellido Materno</Label>
                  <Input {...form.register('apellidoMaterno')} disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Datos de Contacto</CardTitle>
                <CardDescription>
                  Por favor, complete su información de contacto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="calle"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Calle *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Av. Libertador" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="comuna"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comuna *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Santiago" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Región *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Metropolitana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input placeholder="+56 9 1234 5678" {...field} />
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
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input placeholder="juana.perez@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                 {isSubmitting ? (
                  <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.Submit className="mr-2 h-4 w-4" />
                )}
                Completar Registro
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
