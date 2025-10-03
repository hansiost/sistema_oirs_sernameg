
'use client';
import { useState } from 'react';
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
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Solicitud = {
  folio: string;
  tipo: string;
  estado: string;
};

export function EncuestaSatisfaccionDialog({
  open,
  onOpenChange,
  solicitud,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitud: Solicitud | null;
}) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Por favor, seleccione una calificación.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log({
        solicitudId: solicitud?.folio,
        rating,
        comments,
      });
      setIsSubmitting(false);
      onOpenChange(false);
      toast({
        title: '¡Gracias por su opinión!',
        description: 'Su encuesta ha sido enviada correctamente.',
      });
      // Reset fields
      setRating(0);
      setComments('');
    }, 1500);
  };

  if (!solicitud) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Encuesta de Satisfacción</DialogTitle>
          <DialogDescription>
            Su opinión es importante para nosotros. Por favor, evalúe la resolución de su solicitud N° {solicitud.folio}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating">¿Cómo calificaría la atención recibida?</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      (hoverRating || rating) >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios adicionales (opcional)</Label>
            <Textarea
              id="comments"
              placeholder="Déjenos sus comentarios aquí..."
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
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
            {isSubmitting && <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Encuesta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

