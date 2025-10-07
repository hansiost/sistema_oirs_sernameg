
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
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, PlusCircle } from 'lucide-react';
import { Icons } from '@/components/icons';
import { mockFaqs, type FaqItem } from '@/lib/mock-data-faq';

const formSchema = z.object({
  question: z.string().min(10, 'La pregunta debe tener al menos 10 caracteres.'),
  answer: z.string().min(20, 'La respuesta debe tener al menos 20 caracteres.'),
});

type FormValues = z.infer<typeof formSchema>;

const FaqFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const faqId = searchParams.get('id');
  const [mode, setMode] = useState<'create' | 'edit'>(faqId ? 'edit' : 'create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && faqId) {
      const faqToEdit = mockFaqs.find(f => f.id === faqId);
      if (faqToEdit) {
        form.reset(faqToEdit);
      } else {
        toast({
          title: 'Error',
          description: 'Pregunta no encontrada.',
          variant: 'destructive',
        });
        router.push('/backoffice_oirs/mantenedores/preguntas-frecuentes');
      }
    }
  }, [mode, faqId, form, toast, router]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (mode === 'create') {
        console.log('Creating FAQ:', values);
        toast({ title: 'Éxito', description: 'Pregunta frecuente creada correctamente.' });
      } else {
        console.log('Updating FAQ:', values);
        toast({ title: 'Éxito', description: 'Pregunta frecuente actualizada correctamente.' });
      }
      setIsSubmitting(false);
      router.push('/backoffice_oirs/mantenedores/preguntas-frecuentes');
    }, 1000);
  };

  const pageTitle = mode === 'create' ? 'Crear Nueva Pregunta Frecuente' : 'Editar Pregunta Frecuente';
  const pageDescription = mode === 'create'
    ? 'Complete el formulario para agregar una nueva pregunta al sistema.'
    : 'Modifique la pregunta y la respuesta.';
  const buttonText = mode === 'create' ? 'Crear Pregunta' : 'Actualizar Pregunta';
  const ButtonIcon = mode === 'create' ? PlusCircle : Save;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/backoffice_oirs/mantenedores/preguntas-frecuentes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Link>
        </Button>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pregunta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: ¿Qué es la OIRS y cuál es su función?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respuesta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Escriba aquí la respuesta detallada a la pregunta..." className="min-h-32" {...field} />
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


export default function FaqFormPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <FaqFormContent />
        </Suspense>
    )
}
