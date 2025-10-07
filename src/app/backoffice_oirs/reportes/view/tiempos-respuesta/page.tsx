
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import { format, startOfYear, endOfYear } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, FileDown, Calendar as CalendarIcon, FilterX, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { REGIONES_CHILE, REQUEST_TYPES } from '@/lib/constants';

type TiempoRespuesta = {
    region: string;
    consulta: number; // en días
    reclamo: number;
    queja: number;
    sugerencia: number;
    felicitacion: number;
    promedioGeneral: number;
};

// Generar datos de ejemplo
const generateMockData = (): TiempoRespuesta[] => {
  return REGIONES_CHILE.map(region => {
    const consulta = Math.floor(Math.random() * 5) + 1;
    const reclamo = Math.floor(Math.random() * 10) + 3;
    const queja = Math.floor(Math.random() * 12) + 5;
    const sugerencia = Math.floor(Math.random() * 4) + 2;
    const felicitacion = Math.floor(Math.random() * 2) + 1;
    const promedio = (consulta + reclamo + queja + sugerencia + felicitacion) / 5;
    return {
      region,
      consulta,
      reclamo,
      queja,
      sugerencia,
      felicitacion,
      promedioGeneral: Math.round(promedio * 10) / 10,
    };
  });
};

const TiemposRespuestaReport = () => {
    const { toast } = useToast();
    const [data] = useState<TiempoRespuesta[]>(generateMockData());
    const [date, setDate] = useState<DateRange | undefined>({
        from: startOfYear(new Date(2025, 0, 1)),
        to: endOfYear(new Date(2025, 11, 31)),
      });

    const promediosNacionales = useMemo(() => {
        const total = data.length;
        if (total === 0) return { consulta: 0, reclamo: 0, queja: 0, sugerencia: 0, felicitacion: 0, promedioGeneral: 0 };
        const sum = data.reduce((acc, item) => ({
            consulta: acc.consulta + item.consulta,
            reclamo: acc.reclamo + item.reclamo,
            queja: acc.queja + item.queja,
            sugerencia: acc.sugerencia + item.sugerencia,
            felicitacion: acc.felicitacion + item.felicitacion,
            promedioGeneral: acc.promedioGeneral + item.promedioGeneral,
        }), { consulta: 0, reclamo: 0, queja: 0, sugerencia: 0, felicitacion: 0, promedioGeneral: 0 });

        return {
            consulta: Math.round((sum.consulta / total) * 10) / 10,
            reclamo: Math.round((sum.reclamo / total) * 10) / 10,
            queja: Math.round((sum.queja / total) * 10) / 10,
            sugerencia: Math.round((sum.sugerencia / total) * 10) / 10,
            felicitacion: Math.round((sum.felicitacion / total) * 10) / 10,
            promedioGeneral: Math.round((sum.promedioGeneral / total) * 10) / 10,
        };
    }, [data]);
    
    const clearFilters = () => {
        setDate({ from: startOfYear(new Date(2025, 0, 1)), to: endOfYear(new Date(2025, 11, 31)) });
        toast({ title: "Filtros limpiados", description: "Mostrando datos de todo el año." });
    };

    const handleDownload = () => {
        toast({
            title: "Descarga iniciada",
            description: "Se está generando el archivo Excel con los datos del reporte...",
        });
        console.log("Downloading data...", data);
    };
    
    const formatDays = (days: number) => `${days} día${days !== 1 ? 's' : ''}`;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-6 w-6 text-primary" />
                            Reporte: Tiempos de Respuesta por Tipo de Solicitud
                        </CardTitle>
                        <CardDescription>
                            Tiempo de respuesta promedio (en días) para cada tipo de solicitud, desglosado por región.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/backoffice_oirs/reportes">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a Reportes
                            </Link>
                        </Button>
                        <Button onClick={handleDownload}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Descargar Excel
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Seleccione un rango de fechas</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={clearFilters} variant="ghost">
                        <FilterX className="mr-2 h-4 w-4" />
                        Limpiar Filtros
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">Región</TableHead>
                                <TableHead className="text-right font-bold">Consulta</TableHead>
                                <TableHead className="text-right font-bold">Reclamo</TableHead>
                                <TableHead className="text-right font-bold">Queja</TableHead>
                                <TableHead className="text-right font-bold">Sugerencia</TableHead>
                                <TableHead className="text-right font-bold">Felicitación</TableHead>
                                <TableHead className="text-right font-bold">Promedio General</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.region}>
                                <TableCell className="font-medium">{item.region}</TableCell>
                                <TableCell className="text-right">{formatDays(item.consulta)}</TableCell>
                                <TableCell className="text-right">{formatDays(item.reclamo)}</TableCell>
                                <TableCell className="text-right">{formatDays(item.queja)}</TableCell>
                                <TableCell className="text-right">{formatDays(item.sugerencia)}</TableCell>
                                <TableCell className="text-right">{formatDays(item.felicitacion)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatDays(item.promedioGeneral)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="bg-muted/50 hover:bg-muted/80">
                                <TableHead className="font-bold">Promedio Nacional</TableHead>
                                <TableHead className="text-right font-bold">{formatDays(promediosNacionales.consulta)}</TableHead>
                                <TableHead className="text-right font-bold">{formatDays(promediosNacionales.reclamo)}</TableHead>
                                <TableHead className="text-right font-bold">{formatDays(promediosNacionales.queja)}</TableHead>
                                <TableHead className="text-right font-bold">{formatDays(promediosNacionales.sugerencia)}</TableHead>
                                <TableHead className="text-right font-bold">{formatDays(promediosNacionales.felicitacion)}</TableHead>
                                <TableHead className="text-right font-bold">{formatDays(promediosNacionales.promedioGeneral)}</TableHead>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default function TiemposRespuestaPage() {
    return <TiemposRespuestaReport />;
}
