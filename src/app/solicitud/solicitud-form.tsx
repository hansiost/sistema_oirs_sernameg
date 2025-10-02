'use client';

import { useTransition, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

import { REQUEST_TYPES, TOPICS, type RequestType } from '@/lib/constants';
import { GENDER_OPTIONS, INDIGENOUS_PEOPLES } from '@/lib/constants-gender-ethnicity';
import { submitSolicitud } from './actions';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Mocked user data from "Registro Civil"
const mockUserData = {
  rut: '12.345.678-9',
  nombres: 'Juana Andrea',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'González',
  sexo: 'Mujer',
  estadoCivil: 'Soltera',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
  'video/quicktime',
];

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `El tamaño máximo por archivo es 5MB.`)
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type),
    'Tipo de archivo no válido. Permitidos: Imágenes, PDF, Word, Audio, Video.'
  );

const formSchema = z.object({
  calle: z.string().min(3, 'La calle es obligatoria.'),
  numero: z.string().min(1, 'El número es obligatorio.'),
  comuna: z.string().min(3, 'La comuna es obligatoria.'),
  region: z.string().min(3, 'La región es obligatoria.'),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos.'),
  email: z.string().email('El e-mail no es válido.'),
  genero: z.enum(GENDER_OPTIONS, { required_error: 'Debe seleccionar un género.' }),
  puebloOriginario: z.enum(INDIGENOUS_PEOPLES, { required_error: 'Debe seleccionar una opción.' }),
  requestType: z.enum(REQUEST_TYPES, {
    required_error: 'Debe seleccionar un tipo de solicitud.',
  }),
  topic: z.string().min(1, 'Debe seleccionar un tema específico.'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres.'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres.')
    .max(2000, 'La descripción no puede exceder los 2000 caracteres.'),
  attachments: z.array(fileSchema).optional()
    .refine(files => !files || files.reduce((acc, file) => acc + file.size, 0) <= MAX_TOTAL_SIZE, `El tamaño total de los archivos no debe exceder los 25MB.`)
});

type FormValues = z.infer<typeof formSchema>;

export default function SolicitudForm() {
  const { toast } = useToast();
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
      subject: '',
      description: '',
      attachments: [],
    },
  });

  const requestType = form.watch('requestType');
  const descriptionValue = form.watch('description');
  const attachmentsValue = form.watch('attachments') || [];
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  
  const handleRequestTypeChange = (value: string) => {
    const newType = value as RequestType;
    form.setValue('requestType', newType);
    setAvailableTopics(TOPICS[newType] || []);
    form.setValue('topic', '');
  };

  const onSubmit = (values: FormValues) => {
    startSubmitTransition(async () => {
      const formData = new FormData();
      
      Object.entries(mockUserData).forEach(([key, value]) => formData.append(key, value));
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'attachments' && value) {
          formData.append(key, value as string);
        }
      });
      
      if (values.attachments) {
        values.attachments.forEach(file => {
          formData.append('attachments', file);
        });
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
              Revise su información personal. Los campos con * son editables.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
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
             <div className="space-y-1">
              <Label>Sexo</Label>
              <Input value={mockUserData.sexo} disabled />
            </div>
            <div className="space-y-1">
              <Label>Estado Civil</Label>
              <Input value={mockUserData.estadoCivil} disabled />
            </div>
            <FormField
              control={form.control}
              name="genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione su género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
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
              name="puebloOriginario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pueblo Originario *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDIGENOUS_PEOPLES.map((people) => (
                        <SelectItem key={people} value={people}>
                          {people}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Datos de Contacto</CardTitle>
            <CardDescription>
              Por favor, complete su información de contacto. Todos los campos son obligatorios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="calle"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Calle</FormLabel>
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
                    <FormLabel>Número</FormLabel>
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
                    <FormLabel>Comuna</FormLabel>
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
                    <FormLabel>Región</FormLabel>
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
                    <FormLabel>Teléfono</FormLabel>
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
                    <FormLabel>E-mail</FormLabel>
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto o título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Problema con atención en oficina"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                   <div className="flex justify-between items-center">
                    <FormMessage />
                    <div className="text-xs text-muted-foreground ml-auto">
                      {descriptionValue?.length || 0} / 2000
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <Controller
              control={form.control}
              name="attachments"
              render={({ field: { onChange, onBlur, name, ref }, fieldState }) => (
                <FormItem>
                  <FormLabel>Adjuntar Archivos (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept={ALLOWED_FILE_TYPES.join(',')}
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        const currentFiles = form.getValues('attachments') || [];
                        onChange([...currentFiles, ...files]);
                      }}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Puede adjuntar múltiples archivos (imágenes, PDF, Word, audio, video). Tamaño máx. por archivo: 5MB. Total: 25MB.
                  </FormDescription>
                  {attachmentsValue.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <p className="text-sm font-medium">Archivos seleccionados:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {attachmentsValue.map((file, index) => (
                          <li key={index} className="text-sm flex items-center justify-between">
                            <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                const newFiles = [...attachmentsValue];
                                newFiles.splice(index, 1);
                                form.setValue('attachments', newFiles, { shouldValidate: true });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                   {fieldState.error?.root?.message && (
                     <FormMessage>{fieldState.error.root.message}</FormMessage>
                   )}
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
