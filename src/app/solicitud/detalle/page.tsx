
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileCheck2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';


// Mock data matching the list page for consistency
const mockSolicitudesConDetalle = [
  {
    id: '98765',
    datosPersonales: { rut: '12.345.678-9', nombres: 'Juana Andrea', apellidoPaterno: 'Pérez', apellidoMaterno: 'González', sexo: 'Mujer', estadoCivil: 'Soltera' },
    datosContacto: { calle: 'Av. Siempre Viva', numero: '742', comuna: 'Providencia', region: 'Metropolitana de Santiago', telefono: '+56 9 8765 4321', email: 'juana.perez@email.com' },
    identificacionAdicional: { genero: 'Femenino', puebloOriginario: 'Mapuche' },
    detalleSolicitud: { tipo: 'Queja', tema: 'Conducta de funcionario/a', oficinaRegional: 'Metropolitana de Santiago', asunto: 'Demora excesiva en la atención telefónica', descripcion: 'Llevo varios días intentando comunicarme con el centro de la mujer de mi comuna y nadie contesta el teléfono. Necesito orientación urgente y no he podido recibirla. La espera es demasiado larga y frustrante.', adjuntos: [] },
    estado: 'Respondida',
    fecha: '2024-07-20',
    respuesta: { fecha: '22-07-2024', texto: 'Estimada Juana, lamentamos los inconvenientes. Hemos contactado al centro para notificarles y una encargada se comunicará con usted a la brevedad.' },
  },
  {
    id: '98123',
    datosPersonales: { rut: '12.345.678-9', nombres: 'Juana Andrea', apellidoPaterno: 'Pérez', apellidoMaterno: 'González', sexo: 'Mujer', estadoCivil: 'Soltera' },
    datosContacto: { calle: 'Av. Siempre Viva', numero: '742', comuna: 'Providencia', region: 'Metropolitana de Santiago', telefono: '+56 9 8765 4321', email: 'juana.perez@email.com' },
    identificacionAdicional: { genero: 'Femenino', puebloOriginario: 'Mapuche' },
    detalleSolicitud: { tipo: 'Consulta', tema: 'Programas de apoyo y orientación', oficinaRegional: 'Metropolitana de Santiago', asunto: 'Consulta sobre programa Mujeres Jefas de Hogar', descripcion: 'Consulta sobre los requisitos para postular al programa Mujeres Jefas de Hogar...', adjuntos: [] },
    estado: 'En proceso',
    fecha: '2024-07-15',
  },
  {
    id: '97543',
    datosPersonales: { rut: '12.345.678-9', nombres: 'Juana Andrea', apellidoPaterno: 'Pérez', apellidoMaterno: 'González', sexo: 'Mujer', estadoCivil: 'Soltera' },
    datosContacto: { calle: 'Av. Siempre Viva', numero: '742', comuna: 'Providencia', region: 'Metropolitana de Santiago', telefono: '+56 9 8765 4321', email: 'juana.perez@email.com' },
    identificacionAdicional: { genero: 'Femenino', puebloOriginario: 'Mapuche' },
    detalleSolicitud: { tipo: 'Sugerencia', tema: 'Nuevos programas o talleres', oficinaRegional: 'Metropolitana de Santiago', asunto: 'Sugerencia de talleres de alfabetización digital', descripcion: 'Sugerencia para implementar talleres de alfabetización digital para adultas mayores...', adjuntos: [] },
    estado: 'Solicitud Enviada',
    fecha: '2024-06-28',
  },
  {
    id: '96881',
    datosPersonales: { rut: '12.345.678-9', nombres: 'Juana Andrea', apellidoPaterno: 'Pérez', apellidoMaterno: 'González', sexo: 'Mujer', estadoCivil: 'Soltera' },
    datosContacto: { calle: 'Av. Siempre Viva', numero: '742', comuna: 'Providencia', region: 'Metropolitana de Santiago', telefono: '+56 9 8765 4321', email: 'juana.perez@email.com' },
    identificacionAdicional: { genero: 'Femenino', puebloOriginario: 'Mapuche' },
    detalleSolicitud: { tipo: 'Reclamo', tema: 'Atención deficiente en servicio público', oficinaRegional: 'Biobío', asunto: 'Falta de accesibilidad en edificio', descripcion: 'Reclamo por falta de accesibilidad en edificio de la dirección regional...', adjuntos: [] },
    estado: 'Respondida',
    fecha: '2024-06-10',
    respuesta: { fecha: '12-06-2024', texto: 'Estimada Juana, agradecemos su reclamo. Se ha levantado un requerimiento para evaluar e implementar las mejoras de accesibilidad necesarias en el edificio señalado. Esperamos tener una solución en los próximos meses.' },
  },
];


function DetalleContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // In a real application, you would make an API call here.
  // We find the specific request from our mock data.
  const solicitud = mockSolicitudesConDetalle.find(s => s.id === id);

  if (!id || !solicitud) {
    return (
      <div className="text-center">
        <p>No se ha especificado o no se ha encontrado el número de solicitud.</p>
        <Button asChild className="mt-4">
            <Link href="/solicitud/estado">Volver al listado</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center mb-8">
        <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
          <FileCheck2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Detalle de Solicitud N° {solicitud.id}
        </h1>
        <p className="mt-2 text-muted-foreground">
          A continuación se muestra el detalle completo de su solicitud y la respuesta asociada.
        </p>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-1">
                <Label>RUT</Label>
                <Input value={solicitud.datosPersonales.rut} disabled />
            </div>
            <div className="space-y-1">
                <Label>Nombres</Label>
                <Input value={solicitud.datosPersonales.nombres} disabled />
            </div>
            <div className="space-y-1">
                <Label>Apellido Paterno</Label>
                <Input value={solicitud.datosPersonales.apellidoPaterno} disabled />
            </div>
            <div className="space-y-1">
                <Label>Apellido Materno</Label>
                <Input value={solicitud.datosPersonales.apellidoMaterno} disabled />
            </div>
            <div className="space-y-1">
                <Label>Sexo</Label>
                <Input value={solicitud.datosPersonales.sexo} disabled />
            </div>
             <div className="space-y-1">
                <Label>Estado Civil</Label>
                <Input value={solicitud.datosPersonales.estadoCivil} disabled />
            </div>
            <div className="space-y-1">
                <Label>Género</Label>
                <Input value={solicitud.identificacionAdicional.genero} disabled />
            </div>
            <div className="space-y-1">
                <Label>Pueblo Originario</Label>
                <Input value={solicitud.identificacionAdicional.puebloOriginario} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
             <div className="space-y-1 sm:col-span-2">
                <Label>Dirección</Label>
                <Input value={`${solicitud.datosContacto.calle} ${solicitud.datosContacto.numero}, ${solicitud.datosContacto.comuna}`} disabled />
            </div>
             <div className="space-y-1">
                <Label>Teléfono</Label>
                <Input value={solicitud.datosContacto.telefono} disabled />
            </div>
             <div className="space-y-1">
                <Label>E-mail</Label>
                <Input value={solicitud.datosContacto.email} disabled />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalle de la Solicitud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Tipo de Solicitud</Label>
                    <Input value={solicitud.detalleSolicitud.tipo} disabled />
                </div>
                <div className="space-y-1">
                    <Label>Tema Específico</Label>
                    <Input value={solicitud.detalleSolicitud.tema} disabled />
                </div>
            </div>
             <div className="space-y-1">
                <Label>Oficina Regional</Label>
                <Input value={solicitud.detalleSolicitud.oficinaRegional} disabled />
            </div>
            <div className="space-y-1">
                <Label>Asunto</Label>
                <Input value={solicitud.detalleSolicitud.asunto} disabled />
            </div>
            <div className="space-y-1">
                <Label>Descripción</Label>
                <Textarea value={solicitud.detalleSolicitud.descripcion} className="min-h-[120px]" disabled />
            </div>
            {solicitud.detalleSolicitud.adjuntos.length > 0 ? (
                <div className="space-y-1">
                    <Label>Archivos Adjuntos</Label>
                    <p className="text-sm text-muted-foreground">Esta solicitud tiene archivos adjuntos.</p>
                </div>
            ) : (
                 <div className="space-y-1">
                    <Label>Archivos Adjuntos</Label>
                    <p className="text-sm text-muted-foreground">No hay archivos adjuntos para esta solicitud.</p>
                </div>
            )}
          </CardContent>
        </Card>

        {solicitud.estado === 'Respondida' && solicitud.respuesta && (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Respuesta de la Solicitud</CardTitle>
                        <Badge variant="default">{solicitud.estado}</Badge>
                    </div>
                    <CardDescription>
                        Respuesta emitida el {solicitud.respuesta.fecha}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea value={solicitud.respuesta.texto} className="min-h-[150px]" disabled />
                </CardContent>
            </Card>
        )}

    </div>
  );
}


export default function DetalleSolicitudPage() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-background py-8 px-4">
            <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
                <Button variant="ghost" asChild>
                <Link href="/solicitud/estado">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al listado
                </Link>
                </Button>
            </header>
            <main className="w-full max-w-4xl">
                 <Suspense fallback={<div>Cargando detalle de la solicitud...</div>}>
                    <DetalleContent />
                </Suspense>
            </main>
            <footer className="w-full max-w-4xl mt-8 text-center text-xs text-muted-foreground">
                <p>© 2025 SERNAMEG. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

