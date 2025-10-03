
'use client';

import { useTransition, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

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
import { X, Save, ArrowLeft } from 'lucide-react';

import { REQUEST_TYPES, TOPICS, REGIONES_CHILE, VIAS_DE_INGRESO, type RequestType } from '@/lib/constants';
import { GENDER_OPTIONS, INDIGENOUS_PEOPLES } from '@/lib/constants-gender-ethnicity';
import { submitSolicitudInterna } from './actions';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';

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
  rut: z.string(),
  nombres: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  sexo: z.string(),
  estadoCivil: z.string(),
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
  viaIngreso: z.enum(VIAS_DE_INGRESO, { required_error: 'Debe seleccionar una vía de ingreso.' }),
  oficinaRegional: z.enum(REGIONES_CHILE, { required_error: 'Debe seleccionar una oficina regional.' }),
  topic: z.string().min(1, 'Debe seleccionar un tema específico.'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres.'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres.')
    .max(2000, 'La descripción no puede exceder los 2000 caracteres.'),
  attachments: z.array(fileSchema).optional()
    .refine(files => !files || files.reduce((acc, file) => acc + file.size, 0) <= MAX_TOTAL_SIZE, `El tamaño total de los archivos no debe exceder los 25MB.`),
  observacionesOficina: z.string().optional(),
  seguimientoOIRS: z.string().optional(),
  resultadoAtencion: z.string().optional(),
  tipoResolucion: z.string().optional(),
  descripcionRespuesta: z.string().optional(),
  observacionesNivelCentral: z.string().optional(),
  gestionAttachments: z.array(fileSchema).optional()
    .refine(files => !files || files.reduce((acc, file) => acc + file.size, 0) <= MAX_TOTAL_SIZE, `El tamaño total de los archivos no debe exceder los 25MB.`),
});

type FormValues = z.infer<typeof formSchema>;

// Mocked user data from "Registro Civil"
const mockUserApi = (identifier: string) => {
  return new Promise<{
    rut: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    sexo: string;
    estadoCivil: string;
  } | null>((resolve) => {
    setTimeout(() => {
      const cleanedIdentifier = cleanRut(identifier);
      // Check if it's a RUT or a case ID
      if (cleanedIdentifier.startsWith('12345678') || identifier.startsWith('AB-')) {
        resolve({
          rut: '12.345.678-9',
          nombres: 'Juana Andrea',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'González',
          sexo: 'Mujer',
          estadoCivil: 'Soltera',
        });
      } else if (cleanedIdentifier.startsWith('11478406') || identifier.startsWith('CD-')) {
        resolve({
          rut: '11.478.406-0',
          nombres: 'Ana María',
          apellidoPaterno: 'López',
          apellidoMaterno: 'Soto',
          sexo: 'Mujer',
          estadoCivil: 'Casada',
        });
      } else {
        // As a fallback for other IDs, return a generic user
         resolve({
          rut: '9.876.543-K',
          nombres: 'Ciudadana Ejemplo',
          apellidoPaterno: 'Apellido',
          apellidoMaterno: 'Ejemplo',
          sexo: 'Mujer',
          estadoCivil: 'Soltera',
        });
      }
    }, 500);
  });
};

const mockSolicitudData: Partial<FormValues> = {
    calle: "Av. Siempre Viva",
    numero: "742",
    comuna: "Providencia",
    region: "Metropolitana de Santiago",
    telefono: "+56987654321",
    email: "juana.perez@email.com",
    genero: "Femenino",
    puebloOriginario: "Ninguno",
    requestType: "Consulta",
    viaIngreso: "Web",
    oficinaRegional: "Metropolitana de Santiago",
    topic: "Derechos de la mujer",
    subject: "Consulta sobre derechos laborales",
    description: "Quisiera saber más sobre los derechos laborales para mujeres, específicamente en lo que respecta a la igualdad salarial y el acoso en el lugar de trabajo. He sentido que en mi empleo actual no se están respetando estos principios y necesito orientación.",
};


const RESULTADO_ATENCION_OPTIONS = ['Respuesta directa', 'Derivación a programa', 'Derivación a otra institución', 'No aplica', 'Otro'];
const TIPO_RESOLUCION_OPTIONS = ['Resolución favorable', 'Resolución no favorable', 'Sin resolución', 'No aplica'];


export default function SolicitudInternaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isVerifying, startVerifyingTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  
  const editId = searchParams.get('id');
  const [mode, setMode] = useState<'create' | 'edit'>(editId ? 'edit' : 'create');

  const [userFound, setUserFound] = useState(false);
  const [rutInput, setRutInput] = useState('');
  const [isRequestCreated, setIsRequestCreated] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      sexo: '',
      estadoCivil: '',
      calle: '',
      numero: '',
      comuna: '',
      region: '',
      telefono: '',
      email: '',
      requestType: undefined,
      viaIngreso: undefined,
      oficinaRegional: undefined,
      topic: '',
      subject: '',
      description: '',
      attachments: [],
      observacionesOficina: '',
      seguimientoOIRS: '',
      resultadoAtencion: '',
      tipoResolucion: '',
      descripcionRespuesta: '',
      observacionesNivelCentral: '',
      gestionAttachments: [],
    },
  });

  const loadEditData = async (id: string) => {
    // In a real app, this would be an API call to fetch the request data
    toast({ title: 'Cargando solicitud...', description: `Cargando datos para la solicitud N° ${id}.` });
    const userData = await mockUserApi(id); // Use a mock to get user data based on ID
    if (userData) {
        Object.entries(userData).forEach(([key, value]) => {
          form.setValue(key as keyof FormValues, value, { shouldValidate: true });
        });
        Object.entries(mockSolicitudData).forEach(([key, value]) => {
            form.setValue(key as keyof FormValues, value, { shouldValidate: true });
        });
        setUserFound(true);
        setIsRequestCreated(true); // Go directly to management section
        setRutInput(userData.rut);
        toast({ title: 'Solicitud Cargada', description: `Se han cargado los datos para la solicitud N° ${id}.` });
    } else {
        toast({ title: 'Error', description: 'No se pudo cargar la solicitud.', variant: 'destructive' });
        router.push('/backoffice_oirs/dashboard');
    }
  };

  useEffect(() => {
    if (editId) {
      setMode('edit');
      loadEditData(editId);
    }
  }, [editId]);
  
  const handleVerificarRut = () => {
    const result = rutSchema.safeParse(rutInput);
    if (!result.success) {
      form.setError('rut', { type: 'manual', message: result.error.flatten().fieldErrors._errors?.[0] || 'RUT inválido.' });
      return;
    }
    form.clearErrors('rut');

    startVerifyingTransition(async () => {
      const userData = await mockUserApi(result.data);
      if (userData) {
        Object.entries(userData).forEach(([key, value]) => {
          form.setValue(key as keyof FormValues, value);
        });
        setRutInput(userData.rut);
        setUserFound(true);
        toast({
          title: 'Ciudadano Encontrado',
          description: 'Los datos personales han sido cargados. Complete el resto del formulario.',
        });
      } else {
        toast({
          title: 'Ciudadano No Encontrado',
          description: 'No se encontró un usuario con el RUT proporcionado.',
          variant: 'destructive',
        });
        setUserFound(false);
      }
    });
  };

  const requestType = form.watch('requestType');
  const descriptionValue = form.watch('description');
  const attachmentsValue = form.watch('attachments') || [];
  const gestionAttachmentsValue = form.watch('gestionAttachments') || [];
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  useEffect(() => {
      if (requestType) {
          setAvailableTopics(TOPICS[requestType] || []);
      }
  }, [requestType]);
  
  const handleRequestTypeChange = (value: string) => {
    const newType = value as RequestType;
    form.setValue('requestType', newType);
    setAvailableTopics(TOPICS[newType] || []);
    form.setValue('topic', '');
  };

  const onSubmit = (values: FormValues) => {
    startSubmitTransition(async () => {
      const formData = new FormData();
      
      const keysToSubmit: (keyof FormValues)[] = [
        'rut', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'sexo', 'estadoCivil', 'calle', 'numero', 'comuna', 'region', 'telefono', 'email', 'genero', 'puebloOriginario', 'requestType', 'viaIngreso', 'oficinaRegional', 'topic', 'subject', 'description'
      ];

      keysToSubmit.forEach(key => {
         if (values[key]) {
          formData.append(key, values[key] as string);
        }
      });
      
      if (values.attachments) {
        values.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const result = await submitSolicitudInterna(null, formData);

      if (result?.error) {
        toast({
          title: 'Error al enviar',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result?.message) {
        toast({
          title: 'Solicitud Creada',
          description: result.message,
        });
        setIsRequestCreated(true);
      }
    });
  };
  
  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    toast({
        title: 'Solicitud Cerrada',
        description: 'La solicitud ha sido respondida y cerrada. Redirigiendo al dashboard...',
    });
    // Simulate API call before redirecting
    setTimeout(() => {
        router.push('/backoffice_oirs/dashboard');
    }, 1500);
  };

  const pageTitle = mode === 'edit' ? `Gestión de Solicitud N° ${editId}` : 'Formulario de Ingreso de Solicitud Interna';
  const pageDescription = mode === 'edit' ? 'Gestione y responda la solicitud del ciudadano.' : 'Ingrese el RUT del ciudadano para comenzar. Sus datos se cargarán y luego podrá completar la solicitud en su nombre.';
  
  const formError = form.formState.errors.rut;

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {pageTitle}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          {pageDescription}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {mode === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle>1. Identificación del Ciudadano</CardTitle>
                <CardDescription>
                  Ingrese el RUT del ciudadano para buscar y autocompletar sus datos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-full sm:w-auto flex-grow space-y-2">
                    <Label htmlFor="rut">RUT del Ciudadano *</Label>
                    <Input
                      id="rut"
                      placeholder="12.345.678-9"
                      value={rutInput}
                      onChange={(e) => setRutInput(e.target.value)}
                      disabled={isVerifying || userFound}
                      className={formError ? 'border-destructive' : ''}
                    />
                    {formError && <p className="text-sm font-medium text-destructive">{formError.message}</p>}
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
          )}

          {userFound && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Datos Personales</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
                  <FormField
                    control={form.control}
                    name="rut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUT</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apellidoPaterno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Paterno</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apellidoMaterno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Materno</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sexo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estadoCivil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Civil</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="genero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={mode === 'edit'}
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
                        <FormLabel>Pueblo Originario</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                           disabled={mode === 'edit'}
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
                  <CardTitle>Datos de Contacto</CardTitle>
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
                            <Input placeholder="Ej: Av. Libertador" {...field} disabled={mode === 'edit'} />
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
                            <Input placeholder="Ej: 123" {...field} disabled={mode === 'edit'} />
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
                            <Input placeholder="Ej: Santiago" {...field} disabled={mode === 'edit'} />
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
                            <Input placeholder="Ej: Metropolitana" {...field} disabled={mode === 'edit'} />
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
                            <Input placeholder="+56 9 1234 5678" {...field} disabled={mode === 'edit'} />
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
                            <Input placeholder="juana.perez@email.com" {...field} disabled={mode === 'edit'} />
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
                  <CardTitle>Detalle de la Solicitud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <FormField
                    control={form.control}
                    name="viaIngreso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vía de Ingreso</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isRequestCreated}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione la vía de ingreso" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VIAS_DE_INGRESO.map((via) => (
                              <SelectItem key={via} value={via}>
                                {via}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="requestType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Solicitud</FormLabel>
                          <Select
                            onValueChange={handleRequestTypeChange}
                            value={field.value}
                            disabled={isRequestCreated}
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
                          <FormLabel>Tema Específico</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!requestType || availableTopics.length === 0 || isRequestCreated}
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
                      name="oficinaRegional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Oficina Regional a la que dirige la solicitud</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isRequestCreated}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione la oficina regional" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {REGIONES_CHILE.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
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
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asunto o título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Problema con atención en oficina"
                            {...field}
                            disabled={isRequestCreated}
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
                        <FormLabel>Descripción de la solicitud</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explique aquí la situación de la forma más clara posible..."
                            className="min-h-[150px]"
                            {...field}
                            disabled={isRequestCreated}
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
                        <FormLabel>Archivos Adjuntos</FormLabel>
                         {mode === 'create' && (
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
                                disabled={isRequestCreated}
                            />
                            </FormControl>
                         )}
                        <FormDescription>
                           {mode === 'create' ? 'Puede adjuntar múltiples archivos (imágenes, PDF, Word, audio, video). Tamaño máx. por archivo: 5MB. Total: 25MB.' : 'Archivos adjuntados a la solicitud.'}
                        </FormDescription>
                        {attachmentsValue.length > 0 && (
                          <div className="space-y-2 mt-2">
                            <p className="text-sm font-medium">Archivos seleccionados:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {attachmentsValue.map((file, index) => (
                                <li key={index} className="text-sm flex items-center justify-between">
                                  <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                  {mode === 'create' && (
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
                                        disabled={isRequestCreated}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                  )}
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

              {!isRequestCreated && (
                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.Submit className="mr-2 h-4 w-4" />
                    )}
                    Crear Solicitud
                  </Button>
                </div>
              )}
              
              {isRequestCreated && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de la Solicitud</CardTitle>
                      <CardDescription>
                        Complete los campos para gestionar y dar respuesta a la solicitud.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="observacionesOficina"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observaciones de la Oficina Regional</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Añadir observaciones internas sobre el caso..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="seguimientoOIRS"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seguimiento OIRS</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Detalle del seguimiento realizado por OIRS..."
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                          control={form.control}
                          name="resultadoAtencion"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Resultado de la atención</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Seleccione un resultado" />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  {RESULTADO_ATENCION_OPTIONS.map((option) => (
                                      <SelectItem key={option} value={option}>
                                      {option}
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
                          name="tipoResolucion"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Tipo de Resolución</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Seleccione un tipo" />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  {TIPO_RESOLUCION_OPTIONS.map((option) => (
                                      <SelectItem key={option} value={option}>
                                      {option}
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
                        name="descripcionRespuesta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción de la respuesta</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Redacte aquí la respuesta final que se entregará al ciudadano..."
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="observacionesNivelCentral"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observaciones Nivel Central</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Observaciones adicionales del nivel central..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="gestionAttachments"
                        render={({ field: { onChange, onBlur, name, ref }, fieldState }) => (
                          <FormItem>
                            <FormLabel>Adjuntar Archivos a la Gestión</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                multiple
                                accept={ALLOWED_FILE_TYPES.join(',')}
                                onChange={(e) => {
                                  const files = e.target.files ? Array.from(e.target.files) : [];
                                  const currentFiles = form.getValues('gestionAttachments') || [];
                                  onChange([...currentFiles, ...files]);
                                }}
                                onBlur={onBlur}
                                name={name}
                                ref={ref}
                              />
                            </FormControl>
                            <FormDescription>
                              Archivos internos para la gestión del caso.
                            </FormDescription>
                            {gestionAttachmentsValue.length > 0 && (
                              <div className="space-y-2 mt-2">
                                <p className="text-sm font-medium">Archivos de gestión seleccionados:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                  {gestionAttachmentsValue.map((file, index) => (
                                    <li key={index} className="text-sm flex items-center justify-between">
                                      <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => {
                                          const newFiles = [...gestionAttachmentsValue];
                                          newFiles.splice(index, 1);
                                          form.setValue('gestionAttachments', newFiles, { shouldValidate: true });
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
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <div className="flex w-full justify-between items-center">
                    <Button type="button" variant="outline" size="lg" onClick={() => router.push('/backoffice_oirs/dashboard')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Cerrar
                    </Button>
                    <div className="flex gap-4">
                        <Button type="button" variant="secondary" size="lg" onClick={() => toast({ title: 'Gestión Guardada', description: 'Los detalles de la gestión han sido guardados.'})}>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Solicitud
                        </Button>
                        <Button type="button" size="lg" variant="default" onClick={() => setShowConfirmDialog(true)}>
                            <Icons.Submit className="mr-2 h-4 w-4" />
                            Responder y Cerrar Solicitud
                        </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </Form>
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmClose}
        title="¿Responder y Cerrar Solicitud?"
        description="Esta acción marcará la solicitud como completada y la cerrará. ¿Está seguro de que desea continuar?"
        confirmText="Sí, cerrar solicitud"
      />
    </>
  );
}

    