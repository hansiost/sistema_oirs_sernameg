'use client';

import { useTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { REQUEST_TYPES, TOPICS, type RequestType } from '@/lib/constants';
import { getHints, submitSolicitud } from './actions';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Mocked user data from "Registro Civil"
const mockUserData = {
  rut: '12.345.678-9',
  nombres: 'Juana Andrea',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'González',
};

const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size === 0 || file.type.startsWith('image/'),
    'Solo se permiten imágenes.'
  )
  .refine(
    (file) => file.size < 5 * 1024 * 1024,
    'El archivo debe ser menor a 5MB.'
  )
  .optional();

const formSchema = z.object({
  calle: z.string().min(3, 'La calle es obligatoria.'),
  numero: z.string().min(1, 'El número es obligatorio.'),
  comuna: z.string().min(3, 'La comuna es obligatoria.'),
  region: z.string().min(3, 'La región es obligatoria.'),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos.'),
  email: z.string().email('El e-mail no es válido.'),
  requestType: z.enum(REQUEST_TYPES, {
    required_error: 'Debe seleccionar un tipo de solicitud.',
  }),
  topic: z.string().min(1, 'Debe seleccionar un tema específico.'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres.')
    .max(2000, 'La descripción no puede exceder los 2000 caracteres.'),
  attachment: fileSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function SolicitudForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, startSubmitTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calle: '',
      numero: '',
      comuna: '',
      region: '',
      telefono: '',
      email: '',
      topic: '',
      description: '',
    },
  });

  const requestType = form.watch('requestType');
  const descriptionText = form.watch('description');
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  
  const [hintState, hintFormAction, isHintLoading] = useActionState(getHints, { suggestions: [] });

  const handleRequestTypeChange = (value: string) => {
    const newType = value as RequestType;
    form.setValue('requestType', newType);
    setAvailableTopics(TOPICS[newType] || []);
    form.setValue('topic', '');
  };

  const handleGetHints = () => {
    const formData = new FormData();
    formData.append('requestType', requestType);
    formData.append('inputText', descriptionText);
    hintFormAction(formData);
  };

  const onSubmit = (values: FormValues) => {
    startSubmitTransition(async () => {
      const formData = new FormData();
      
      // Append user and form data
      Object.entries(mockUserData).forEach(([key, value]) => formData.append(key, value));
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'attachment' && value) {
          formData.append(key, value);
        }
      });
      
      // Append file if it exists
      if (values.attachment) {
        formData.append('attachment', values.attachment);
      }

      const result = await submitSolicitud(null, formData);

      if (result?.error) {
        toast({
          title: 'Error al enviar',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Datos Personales</CardTitle>
            <CardDescription>
              Esta información es obtenida del Registro Civil y no puede ser
              modificada.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>RUT</Label>
              <Input value={mockUserData.rut} disabled />
            </div>
            <div className="space-y-1">
              <Label>Nombres</Label>
              <Input value={mockUserData.nombres} disabled />
            </div>
            <div className="space-y-1">
              <Label>Apellido Paterno</Label>
              <Input value={mockUserData.apellidoPaterno} disabled />
            </div>
            <div className="space-y-1">
              <Label>Apellido Materno</Label>
              <Input value={mockUserData.apellidoMaterno} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Datos de Contacto</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>3. Detalle de la Solicitud</CardTitle>
            <CardDescription>
              Seleccione el tipo de solicitud y describa su requerimiento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Solicitud *</FormLabel>
                    <Select
                      onValueChange={handleRequestTypeChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REQUEST_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                               {(() => {
                                const Icon = Icons[type as keyof typeof Icons];
                                return Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null;
                               })()}
                               <span>{type}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema Específico *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!requestType || availableTopics.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de la solicitud *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explique aquí su situación de la forma más clara posible..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {requestType && requestType !== 'Felicitacion' && (
              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <h4 className="font-semibold text-accent-foreground">Asistente de Redacción</h4>
                    <p className="text-sm text-muted-foreground">
                      Obtenga sugerencias de nuestra IA para mejorar su solicitud.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGetHints}
                    disabled={isHintLoading || !requestType || descriptionText.length < 10}
                  >
                    {isHintLoading ? (
                      <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Obtener Sugerencias
                  </Button>
                </div>
                {isHintLoading && <p className="text-sm text-muted-foreground animate-pulse">Generando sugerencias...</p>}
                {hintState?.error && <p className="text-sm text-destructive">{hintState.error}</p>}
                {hintState?.suggestions && hintState.suggestions.length > 0 && (
                   <Alert variant="default" className="bg-background">
                     <Icons.Sparkles className="h-4 w-4" />
                     <AlertTitle>Sugerencias para mejorar su texto:</AlertTitle>
                     <AlertDescription>
                       <ul className="list-disc pl-5 space-y-1 mt-2">
                         {hintState.suggestions.map((suggestion, index) => (
                           <li key={index}>{suggestion}</li>
                         ))}
                       </ul>
                     </AlertDescription>
                   </Alert>
                )}
              </div>
            )}


            <FormField
              control={form.control}
              name="attachment"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Adjuntar Archivo (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      {...rest}
                    />
                  </FormControl>
                  <FormDescription>
                    Puede adjuntar una imagen (JPG, PNG) de hasta 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
             {isSubmitting ? (
              <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.Submit className="mr-2 h-4 w-4" />
            )}
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </Form>
  );
}
