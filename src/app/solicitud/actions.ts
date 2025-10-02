'use server';

import { z } from 'zod';
import { REQUEST_TYPES } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { GENDER_OPTIONS, INDIGENOUS_PEOPLES } from '@/lib/constants-gender-ethnicity';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
    'Tipo de archivo no válido.'
  );

const SolicitudSchema = z.object({
  rut: z.string(),
  nombres: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  sexo: z.string(),
  estadoCivil: z.string(),
  calle: z.string().min(1, 'La calle es obligatoria.'),
  numero: z.string().min(1, 'El número es obligatorio.'),
  comuna: z.string().min(1, 'La comuna es obligatoria.'),
  region: z.string().min(1, 'La región es obligatoria.'),
  telefono: z.string().min(8, 'El teléfono es obligatorio.'),
  email: z.string().email('El e-mail no es válido.'),
  genero: z.enum(GENDER_OPTIONS, { required_error: 'Debe seleccionar un género.' }),
  puebloOriginario: z.enum(INDIGENOUS_PEOPLES, { required_error: 'Debe seleccionar una opción.' }),
  requestType: z.enum(REQUEST_TYPES),
  topic: z.string().min(1, 'Debe seleccionar un tema.'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres.'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres.')
    .max(2000, 'La descripción no puede exceder los 2000 caracteres.'),
  attachments: z.array(fileSchema).optional(),
});

export async function submitSolicitud(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  
  const attachments = formData.getAll('attachments') as File[];

  const validatedFields = SolicitudSchema.safeParse({
    rut: formData.get('rut'),
    nombres: formData.get('nombres'),
    apellidoPaterno: formData.get('apellidoPaterno'),
    apellidoMaterno: formData.get('apellidoMaterno'),
    sexo: formData.get('sexo'),
    estadoCivil: formData.get('estadoCivil'),
    calle: formData.get('calle'),
    numero: formData.get('numero'),
    comuna: formData.get('comuna'),
    region: formData.get('region'),
    telefono: formData.get('telefono'),
    email: formData.get('email'),
    genero: formData.get('genero'),
    puebloOriginario: formData.get('puebloOriginario'),
    requestType: formData.get('requestType'),
    topic: formData.get('topic'),
    subject: formData.get('subject'),
    description: formData.get('description'),
    attachments: attachments.filter(file => file.size > 0),
  });
  
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Formulario inválido. Por favor revise los campos.',
    };
  }

  // In a real application, you would save this data to a database
  // and upload the file to a storage service.
  console.log('Solicitud Recibida:', validatedFields.data);
  
  if (validatedFields.data.attachments && validatedFields.data.attachments.length > 0) {
    console.log('Archivos adjuntos:');
    validatedFields.data.attachments.forEach(file => {
      console.log({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newFolio = Math.floor(Math.random() * 90000 + 10000);

  // Redirect to status page instead of returning a message
  redirect(`/solicitud/estado?folio=${newFolio}&tipo=${validatedFields.data.requestType}`);
}
