'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const RegistroSchema = z.object({
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
  password: z.string().min(8, 'La clave debe tener al menos 8 caracteres.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las claves no coinciden.",
  path: ["confirmPassword"],
});


export async function submitRegistro(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const validatedFields = RegistroSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Formulario inválido. Por favor revise los campos.',
    };
  }

  // In a real application, you would save this data to a database.
  console.log('Datos de Registro Recibidos:', validatedFields.data);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  redirect('/solicitud/estado');
}
