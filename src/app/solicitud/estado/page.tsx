'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, CheckCircle, ClipboardList } from 'lucide-react';
import { REQUEST_TYPES } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EncuestaSatisfaccionDialog } from '@/components/encuesta-satisfaccion-dialog';
import { SurveyDetailsDialog, type SurveyData } from '@/components/survey-details-dialog';

type Solicitud = {
  folio: string;
  tipo: string;
  fecha: string;
  descripcion: string;
  estado: string;
  surveyData?: SurveyData;
};

const mockSolicitudes: Solicitud[] = [
  {
    folio: '98765',
    tipo: 'Queja',
    fecha: '2024-07-20',
    descripcion: 'Demora excesiva en la atención telefónica del centro de la mujer...',
    estado: 'Respondida',
    surveyData: {
        ratings: { amabilidad: 4, claridad: 5, tiempo: 3, resolucion: 4, accesibilidad: 4 },
        promedio: 4, 
        comments: 'La respuesta fue rápida, pero podría haber sido un poco más detallada. Agradezco la gestión.' 
    },
  },
  {
    folio: '98123',
    tipo: 'Consulta',
    fecha: '2024-07-15',
    descripcion: 'Consulta sobre los requisitos para postular al programa Mujeres Jefas de Hogar...',
    estado: 'En proceso',
  },
  {
    folio: '97543',
    tipo: 'Sugerencia',
    fecha: '2024-06-28',
    descripcion: 'Sugerencia para implementar talleres de alfabetización digital para adultas mayores...',
    estado: 'Solicitud Enviada',
  },
  {
    folio: '96881',
    tipo: 'Reclamo',
    fecha: '2024-06-10',
    descripcion: 'Reclamo por falta de accesibilidad en edificio de la dirección regional...',
    estado: 'Respondida',
  },
];

// Mocked user data from "Registro Civil"
const mockUserData = {
  rut: '12.345.678-9',
  nombres: 'Juana Andrea',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'González',
  sexo: 'Mujer',
  estadoCivil: 'Soltera',
  genero: 'Femenino',
  puebloOriginario: 'Mapuche',
};

const getStatusVariant = (estado: string) => {
  switch (estado) {
    case 'Respondida':
      return 'default';
    case 'En proceso':
      return 'secondary';
    case 'Solicitud Enviada':
      return 'outline';
    default:
      return 'outline';
  }
};

function EstadoSolicitudesContent() {
  const searchParams = useSearchParams();
  const newFolio = searchParams.get('folio');
  const newTipo = searchParams.get('tipo');

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(() => {
     let initialSolicitudes = [...mockSolicitudes];
      if (newFolio && !initialSolicitudes.some(s => s.folio === newFolio)) {
        const newRequest = {
            folio: newFolio,
            tipo: (newTipo as (typeof REQUEST_TYPES)[number]) || 'Consulta',
            fecha: new Date().toISOString().split('T')[0],
            descripcion: 'Nueva solicitud recién enviada...',
            estado: 'Solicitud Enviada'
        };
        initialSolicitudes.unshift(newRequest);
    }
    return initialSolicitudes;
  });
  
  const [showSurveyDialog, setShowSurveyDialog] = useState(false);
  const [showSurveyDetailsDialog, setShowSurveyDetailsDialog] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  
  const handleOpenSurvey = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowSurveyDialog(true);
  };
  
  const handleOpenSurveyDetails = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowSurveyDetailsDialog(true);
  };

  const handleSurveySubmit = (folio: string, surveyData: SurveyData) => {
     setSolicitudes(prev => 
        prev.map(s => s.folio === folio ? {...s, surveyData: surveyData} : s)
     );
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
        <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/portal_ciudadano">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/solicitud">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Solicitud
                </Link>
            </Button>
          </div>
        </header>
        <main className="w-full max-w-4xl space-y-8">
          {newFolio && (
            <div className="p-4 bg-green-50 text-green-900 rounded-lg flex items-start space-x-3 border border-green-200">
               <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-500" />
               <div className="flex-1">
                 <h3 className="font-bold">¡Solicitud enviada con éxito!</h3>
                 <p>
                   Su solicitud ha sido registrada con el folio <strong>N° {newFolio}</strong>. Puede revisar el estado de todas sus solicitudes a continuación.
                 </p>
               </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Mis Datos</CardTitle>
              <CardDescription>
                Esta información es obtenida del Registro Civil y no puede ser modificada.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
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
               <div className="space-y-1">
                <Label>Género</Label>
                <Input value={mockUserData.genero} disabled />
              </div>
              <div className="space-y-1">
                <Label>Pueblo Originario</Label>
                <Input value={mockUserData.puebloOriginario} disabled />
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Mis Solicitudes</CardTitle>
              <CardDescription>
                Aquí puede ver el historial y el estado de todas sus solicitudes ingresadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">N° de Caso</TableHead>
                    <TableHead>Tipo Solicitud</TableHead>
                    <TableHead>Fecha de Envío</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado Solicitud</TableHead>
                    <TableHead className="text-right">Encuesta de Satisfacción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudes.map((solicitud) => {
                    const isSurveySubmitted = !!solicitud.surveyData;
                    const canSubmitSurvey = solicitud.estado === 'Respondida' && !isSurveySubmitted;
                    return (
                      <TableRow key={solicitud.folio}>
                        <TableCell className="font-medium">
                          <Button variant="link" asChild className="p-0 h-auto">
                              <Link href={`/solicitud/detalle?id=${solicitud.folio}`}>
                                  {solicitud.folio}
                              </Link>
                          </Button>
                        </TableCell>
                        <TableCell>{solicitud.tipo}</TableCell>
                        <TableCell>{new Date(solicitud.fecha).toLocaleDateString('es-CL')}</TableCell>
                        <TableCell>{solicitud.descripcion.substring(0, 30)}...</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(solicitud.estado) as any}>
                            {solicitud.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {isSurveySubmitted ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSurveyDetails(solicitud)}
                              aria-label="Ver encuesta enviada"
                              className="text-green-500 hover:text-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSurvey(solicitud)}
                              aria-label="Realizar encuesta de satisfacción"
                              disabled={!canSubmitSurvey}
                            >
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
        <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
          <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
        </footer>
      </div>
       {selectedSolicitud && (
         <EncuestaSatisfaccionDialog
           open={showSurveyDialog}
           onOpenChange={setShowSurveyDialog}
           solicitud={selectedSolicitud}
           onSurveySubmit={handleSurveySubmit}
         />
       )}
       {selectedSolicitud && (
         <SurveyDetailsDialog
            open={showSurveyDetailsDialog}
            onOpenChange={setShowSurveyDetailsDialog}
            survey={selectedSolicitud.surveyData}
          />
       )}
    </>
  );
}

export default function EstadoSolicitudesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EstadoSolicitudesContent />
    </Suspense>
  );
}
