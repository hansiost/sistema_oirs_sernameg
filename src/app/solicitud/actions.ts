'use server';

import { z } from 'zod';
import { getHelpfulHintSuggestions } from '@/ai/flows/helpful-hint-suggestions';
import { REQUEST_TYPES } from '@/lib/constants';
import { redirect } from 'next/navigation';

const HintSchema = z.object({
  requestType: z.enum(['Reclamo', 'Consulta', 'Sugerencia', 'Queja']),
  inputText: z.string().min(10, 'Se requieren al menos 10 caracteres.'),
});

export async function getHints(
  prevState: any,
  formData: FormData
): Promise<{ suggestions?: string[]; error?: string }> {
  const validatedFields = HintSchema.safeParse({
    requestType: formData.get('requestType'),
    inputText: formData.get('inputText'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.inputText?.[0],
    };
  }

  try {
    const result = await getHelpfulHintSuggestions(validatedFields.data);
    if (result.suggestions && result.suggestions.length > 0) {
      return { suggestions: result.suggestions };
    }
    return { error: 'No se pudieron generar sugerencias en este momento.' };
  } catch (error) {
    console.error('AI Error:', error);
    return { error: 'Hubo un error al comunicarse con el asistente de IA.' };
  }
}

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size < 5 * 1024 * 1024, 'El archivo debe ser menor a 5MB.')
  .optional();

const SolicitudSchema = z.object({
  rut: z.string(),
  nombres: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  calle: z.string().min(1, 'La calle es obligatoria.'),
  numero: z.string().min(1, 'El número es obligatorio.'),
  comuna: z.string().min(1, 'La comuna es obligatoria.'),
  region: z.string().min(1, 'La región es obligatoria.'),
  telefono: z.string().min(8, 'El teléfono es obligatorio.'),
  email: z.string().email('El e-mail no es válido.'),
  requestType: z.enum(REQUEST_TYPES),
  topic: z.string().min(1, 'Debe seleccionar un tema.'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres.'),
  attachment: fileSchema,
});

export async function submitSolicitud(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const validatedFields = SolicitudSchema.safeParse({
    rut: formData.get('rut'),
    nombres: formData.get('nombres'),
    apellidoPaterno: formData.get('apellidoPaterno'),
    apellidoMaterno: formData.get('apellidoMaterno'),
    calle: formData.get('calle'),
    numero: formData.get('numero'),
    comuna: formData.get('comuna'),
    region: formData.get('region'),
    telefono: formData.get('telefono'),
    email: formData.get('email'),
    requestType: formData.get('requestType'),
    topic: formData.get('topic'),
    description: formData.get('description'),
    attachment: formData.get('attachment'),
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
  
  if (validatedFields.data.attachment && validatedFields.data.attachment.size > 0) {
    console.log('Archivo adjunto:', {
      name: validatedFields.data.attachment.name,
      size: validatedFields.data.attachment.size,
      type: validatedFields.data.attachment.type,
    });
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newFolio = Math.floor(Math.random() * 90000 + 10000);

  // Redirect to status page instead of returning a message
  redirect(`/solicitud/estado?folio=${newFolio}&tipo=${validatedFields.data.requestType}`);
}
