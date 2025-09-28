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

const cleanRut = (rut: string) => rut.replace(/[^0-9kK]/g, '').toUpperCase();

const rutSchema = z
  .string()
  .min(8, 'El RUT debe tener al menos 8 caracteres.')
  .refine(
    (value) => {
      const cleaned = cleanRut(value);
      if (cleaned.length < 2) return false;
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      if (!/^[0-9]+$/.test(body)) return false;
      return /^[0-9K]$/.test(dv);
    },
    'Formato de RUT no válido (ej: 12.345.678-9).'
  );

const formatRut = (rut: string) => {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  let formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
};

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
  password: z.string().min(8, 'La clave debe tener al menos 8 caracteres.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las claves no coinciden.",
  path: ["confirmPassword"], // path of error
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
      const cleanedRut = cleanRut(rut);
      if (cleanedRut.startsWith('12345678')) {
        resolve({
          nombres: 'Juana Andrea',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'González',
        });
      } else if (cleanedRut.startsWith('11478406')) {
        resolve({
          nombres: 'Ana María',
          apellidoPaterno: 'López',
          apellidoMaterno: 'Soto',
        });
      }
       else {
        resolve(null);
      }
    }, 1000);
  });
};

// Simulate checking if user is already registered in our DB
const checkExistingRegistration = (rut: string) => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      const cleanedRut = cleanRut(rut);
      // '11.478.406-0' is the existing user
      if (cleanedRut.startsWith('11478406')) {
        resolve(true); // Already registered
      } else {
        resolve(false); // Not registered
      }
    }, 800)
  })
}


// --- Component ---

export default function RegistroForm() {
  const { toast } = useToast();
  const [isVerifying, startVerifyingTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [userFound, setUserFound] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState<boolean|null>(null);
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
      password: '',
      confirmPassword: '',
    },
  });

  const handleVerificarRut = () => {
    const result = rutSchema.safeParse(rutInput);
    if (!result.success) {
      form.setError('rut', {
        type: 'manual',
        message:
          result.error.flatten().fieldErrors._errors?.[0] || 'RUT inválido.',
      });
      return;
    }
    form.clearErrors('rut');

    startVerifyingTransition(async () => {
      const userData = await mockUserApi(result.data);
      if (userData) {
        const formatted = formatRut(result.data);
        form.setValue('rut', formatted);
        setRutInput(formatted); // Show formatted RUT in input
        form.setValue('nombres', userData.nombres);
        form.setValue('apellidoPaterno', userData.apellidoPaterno);
        form.setValue('apellidoMaterno', userData.apellidoMaterno);
        setUserFound(true);

        const isRegistered = await checkExistingRegistration(result.data);
        setIsAlreadyRegistered(isRegistered);

        if (isRegistered) {
           toast({
            title: 'Usuario Ya Registrado',
            description: 'El RUT ingresado ya tiene una cuenta. Puede iniciar sesión directamente.',
            variant: 'destructive',
          });
        } else {
           toast({
            title: 'Usuario Encontrado',
            description:
              'Sus datos personales han sido cargados. Por favor, cree una clave y complete su información de contacto.',
          });
        }
      } else {
        toast({
          title: 'Usuario No Encontrado',
          description:
            'No se encontró un usuario con el RUT proporcionado. Pruebe con un RUT de ejemplo.',
          variant: 'destructive',
        });
        setUserFound(false);
        setIsAlreadyRegistered(null);
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
        setIsAlreadyRegistered(null);
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
                 {!formError && <FormDescription>Para la simulación, use RUT nuevo (12.345.678-9) o registrado (11.478.406-0).</FormDescription>}
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
             {isAlreadyRegistered === true && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Usuario ya registrado</AlertTitle>
                    <AlertDescription>
                        El RUT ingresado ya tiene una cuenta. Por favor, <a href="/solicitud/estado" className="font-bold underline">inicie sesión</a> para ver sus solicitudes.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>

        {userFound && isAlreadyRegistered === false && (
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
                <CardTitle>3. Cree su Clave</CardTitle>
                 <CardDescription>
                  Esta será su clave para ingresar al portal en el futuro.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clave *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Clave *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Datos de Contacto</CardTitle>
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

    