
'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Icons } from './icons';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

type Solicitud = {
  folio: string;
  tipo: string;
  estado: string;
};

const surveyQuestions = [
    { id: 'amabilidad', label: 'Amabilidad del personal' },
    { id: 'claridad', label: 'Claridad de la información entregada' },
    { id: 'tiempo', label: 'Tiempo de respuesta' },
    { id: 'resolucion', label: 'Resolución de su requerimiento' },
    { id: 'accesibilidad', label: 'Accesibilidad y comodidad del servicio' },
];

const ratingOptions = [
    { value: '5', label: 'Muy buena' },
    { value: '4', label: 'Buena' },
    { value: '3', label: 'Regular' },
    { value: '2', label: 'Mala' },
    { value: '1', label: 'Muy Mala' },
]

export function EncuestaSatisfaccionDialog({
  open,
  onOpenChange,
  solicitud,
  onSurveySubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitud: Solicitud | null;
  onSurveySubmit: (folio: string) => void;
}) {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, string | undefined>>({});
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when the dialog is closed or the solicitud changes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setRatings({});
        setComments('');
        setIsSubmitting(false);
      }, 300); // Delay to allow animation to finish
    }
  }, [open]);

  const handleRatingChange = (questionId: string, value: string) => {
    setRatings(prev => ({...prev, [questionId]: value }));
  }

  const allQuestionsAnswered = surveyQuestions.every(q => ratings[q.id]);

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!solicitud) return;
    
    if (!allQuestionsAnswered) {
      toast({
        title: 'Error',
        description: 'Por favor, responda todas las preguntas de la encuesta.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const numericRatings = Object.fromEntries(
        Object.entries(ratings).map(([key, value]) => [key, Number(value)])
      );
      const totalRating = Object.values(numericRatings).reduce((acc, val) => acc + val, 0);
      const averageRating = totalRating / surveyQuestions.length;

      console.log({
        solicitudId: solicitud.folio,
        ratings: numericRatings,
        average: averageRating.toFixed(1),
        comments,
      });

      onSurveySubmit(solicitud.folio);
      setIsSubmitting(false);
      onOpenChange(false);
      toast({
        title: '¡Gracias por su opinión!',
        description: 'Su encuesta ha sido enviada correctamente.',
      });
    }, 1500);
  };

  if (!solicitud) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Encuesta de Satisfacción</DialogTitle>
          <DialogDescription>
            Su opinión es importante. Por favor, evalúe la atención recibida para su solicitud N° {solicitud.folio}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <h4 className="font-semibold text-lg">¿Cómo evalúa la atención recibida?</h4>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-2 text-left font-semibold">Aspecto</th>
                            {ratingOptions.map(opt => (
                                <th key={opt.value} className="p-2 text-center font-semibold">{opt.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {surveyQuestions.map((question, index) => (
                           <tr key={question.id} className={index < surveyQuestions.length -1 ? 'border-b' : ''}>
                                <td className="p-3 font-medium text-sm">{question.label}</td>
                                {ratingOptions.map(opt => (
                                    <td key={opt.value} className="p-3 text-center">
                                         <RadioGroup 
                                            onValueChange={(value) => handleRatingChange(question.id, value)} 
                                            value={ratings[question.id]}
                                            className="flex justify-center"
                                        >
                                            <RadioGroupItem value={opt.value} id={`${question.id}-${opt.value}`} />
                                        </RadioGroup>
                                    </td>
                                ))}
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Separator />
            <div className="space-y-2">
                <Label htmlFor="comments">Comentarios adicionales (opcional)</Label>
                <Textarea
                id="comments"
                placeholder="Déjenos sus comentarios para mejorar nuestro servicio..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={isSubmitting}
                />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !allQuestionsAnswered}>
            {isSubmitting && <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Encuesta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
