
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type SurveyData = {
  rating: number;
  comments: string;
} | null | undefined;

interface SurveyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey: SurveyData;
}

export function SurveyDetailsDialog({ open, onOpenChange, survey }: SurveyDetailsDialogProps) {
  if (!survey) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalle de la Encuesta</DialogTitle>
          <DialogDescription>
            Resultado de la encuesta de satisfacción enviada por el ciudadano.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Calificación</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-6 w-6',
                    survey.rating >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Comentarios</Label>
            <Textarea
              value={survey.comments || 'El ciudadano no dejó comentarios.'}
              readOnly
              className="min-h-[120px] bg-muted/50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
