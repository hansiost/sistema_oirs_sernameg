
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
  {
    question: '¿Qué es la OIRS y cuál es su función?',
    answer:
      'La Oficina de Información, Reclamos y Sugerencias (OIRS) es el canal oficial de comunicación entre la ciudadanía y SERNAMEG. Su función es facilitar el acceso a la información, recibir y gestionar reclamos, consultas, sugerencias y felicitaciones sobre el quehacer institucional.',
  },
  {
    question: '¿Cómo puedo ingresar una solicitud?',
    answer:
      'Puede ingresar una solicitud a través de este Portal Ciudadano, utilizando su ClaveÚnica o registrándose con su RUT. También puede hacerlo de forma presencial en nuestras oficinas regionales o a través de otros canales como teléfono o correspondencia.',
  },
  {
    question: '¿Cuáles son los plazos de respuesta para una solicitud?',
    answer:
      'Los plazos de respuesta varían según el tipo de solicitud. Por ley, el plazo general para dar respuesta a las solicitudes ciudadanas es de 20 días hábiles. Sin embargo, para casos de violencia u otros temas urgentes, se prioriza una gestión más expedita.',
  },
  {
    question: '¿Puedo hacer seguimiento a mi solicitud?',
    answer:
      'Sí. Una vez que ingresa a este portal con su RUT, en la sección "Mis Solicitudes" podrá ver el listado de todas sus solicitudes y el estado en que se encuentran. Al hacer clic en el número de caso, podrá ver el detalle completo.',
  },
  {
    question: '¿Es confidencial la información que entrego?',
    answer:
      'Sí. Toda la información personal y los detalles de su solicitud son tratados de manera confidencial, de acuerdo a la Ley N° 19.628 sobre Protección de la Vida Privada. Solo el personal autorizado tendrá acceso a sus datos para gestionar su requerimiento.',
  },
];


export default function PreguntasFrecuentesPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
      <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/solicitud/estado">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mis Solicitudes
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <div className="text-center mb-8">
            <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
                <HelpCircle className="h-10 w-10 text-primary" />
            </div>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Preguntas Frecuentes
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Encuentre respuestas a las dudas más comunes sobre el proceso de solicitudes y el funcionamiento de la OIRS.
          </p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Preguntas Generales</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>

      </main>
      <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
        <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
