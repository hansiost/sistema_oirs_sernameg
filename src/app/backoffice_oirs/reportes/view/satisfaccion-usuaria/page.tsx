
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
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileDown, Calendar as CalendarIcon, FilterX, Star, BarChart3 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { REGIONES_CHILE } from '@/lib/constants';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

type SatisfaccionData = {
    region: string;
    cantidadEncuestas: number;
    promedioCalificacion: number;
    distribucion: { '5': number; '4': number; '3': number; '2': number; '1': number; }; // percentages
};

// Generar datos de ejemplo
const generateMockData = (): SatisfaccionData[] => {
  return REGIONES_CHILE.map(region => {
    const cantidadEncuestas = Math.floor(Math.random() * 100) + 10;
    const d5 = Math.random() * 0.6 + 0.3; // 30-90%
    const d4 = Math.random() * (1 - d5) * 0.7;
    const d3 = Math.random() * (1 - d5 - d4) * 0.6;
    const d2 = Math.random() * (1 - d5 - d4 - d3) * 0.5;
    const d1 = 1 - d5 - d4 - d3 - d2;
    
    const promedio = d5 * 5 + d4 * 4 + d3 * 3 + d2 * 2 + d1 * 1;

    return {
      region,
      cantidadEncuestas,
      promedioCalificacion: Math.round(promedio * 10) / 10,
      distribucion: {
        '5': Math.round(d5 * 100),
        '4': Math.round(d4 * 100),
        '3': Math.round(d3 * 100),
        '2': Math.round(d2 * 100),
        '1': Math.round(d1 * 100),
      },
    };
  });
};

const chartConfig = {
  promedio: { label: 'Promedio Calificación', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;


const SatisfaccionBarChart = ({ data }: { data: SatisfaccionData[] }) => {
    const chartData = data.map(item => ({
        region: item.region,
        promedio: item.promedioCalificacion
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Calificación Promedio por Región
                </CardTitle>
                <CardDescription>Comparación de la calificación promedio (de 1 a 5) entre regiones.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <BarChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="region"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis domain={[0, 5]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="promedio" fill="var(--color-promedio)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};


const SatisfaccionReport = () => {
    const { toast } = useToast();
    const [data] = useState<SatisfaccionData[]>(generateMockData());
    const [date, setDate] = useState<DateRange | undefined>({
        from: startOfYear(new Date(2025, 0, 1)),
        to: endOfYear(new Date(2025, 11, 31)),
      });

    const promediosNacionales = useMemo(() => {
        const totalEncuestas = data.reduce((acc, item) => acc + item.cantidadEncuestas, 0);
        if (totalEncuestas === 0) return { cantidadEncuestas: 0, promedioCalificacion: 0, distribucion: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 } };

        const promedioPonderado = data.reduce((acc, item) => acc + (item.promedioCalificacion * item.cantidadEncuestas), 0) / totalEncuestas;
        
        const distSum = data.reduce((acc, item) => {
            acc['5'] += item.distribucion['5'] * item.cantidadEncuestas;
            acc['4'] += item.distribucion['4'] * item.cantidadEncuestas;
            acc['3'] += item.distribucion['3'] * item.cantidadEncuestas;
            acc['2'] += item.distribucion['2'] * item.cantidadEncuestas;
            acc['1'] += item.distribucion['1'] * item.cantidadEncuestas;
            return acc;
        }, { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 });

        return {
            cantidadEncuestas: totalEncuestas,
            promedioCalificacion: Math.round(promedioPonderado * 10) / 10,
            distribucion: {
                '5': Math.round(distSum['5'] / totalEncuestas),
                '4': Math.round(distSum['4'] / totalEncuestas),
                '3': Math.round(distSum['3'] / totalEncuestas),
                '2': Math.round(distSum['2'] / totalEncuestas),
                '1': Math.round(distSum['1'] / totalEncuestas),
            }
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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-6 w-6 text-primary" />
                                Reporte: Satisfacción Usuaria
                            </CardTitle>
                            <CardDescription>
                                Nivel de satisfacción de las usuarias por región, basado en las encuestas de atención.
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
                                className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                                    <TableHead className="text-right font-bold">Cant. Encuestas</TableHead>
                                    <TableHead className="text-center font-bold">Calificación Promedio</TableHead>
                                    <TableHead className="w-[30%] font-bold text-center">Distribución de Calificaciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.region}>
                                    <TableCell className="font-medium">{item.region}</TableCell>
                                    <TableCell className="text-right">{item.cantidadEncuestas}</TableCell>
                                    <TableCell className="text-center font-semibold">
                                        <div className="flex items-center justify-center gap-1">
                                            {item.promedioCalificacion.toFixed(1)} <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            {(Object.keys(item.distribucion) as (keyof typeof item.distribucion)[]).sort((a,b) => parseInt(b) - parseInt(a)).map(key => (
                                                <div key={key} className="flex items-center gap-2 text-xs">
                                                    <span className="w-12">{key} Estrella{key !== '1' ? 's' : ''}</span>
                                                    <Progress value={item.distribucion[key]} className="flex-1 h-3" />
                                                    <span className="w-10 text-right">{item.distribucion[key]}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-muted/50 hover:bg-muted/80">
                                    <TableHead className="font-bold">Total / Promedio Nacional</TableHead>
                                    <TableHead className="text-right font-bold">{promediosNacionales.cantidadEncuestas}</TableHead>
                                    <TableHead className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-1">
                                            {promediosNacionales.promedioCalificacion.toFixed(1)} <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        </div>
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex flex-col gap-1.5">
                                             {(Object.keys(promediosNacionales.distribucion) as (keyof typeof promediosNacionales.distribucion)[]).sort((a,b) => parseInt(b) - parseInt(a)).map(key => (
                                                <div key={key} className="flex items-center gap-2 text-xs">
                                                    <span className="w-12">{key} Estrella{key !== '1' ? 's' : ''}</span>
                                                    <Progress value={promediosNacionales.distribucion[key]} className="flex-1 h-3" />
                                                    <span className="w-10 text-right">{promediosNacionales.distribucion[key]}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <div className="mt-6">
                <SatisfaccionBarChart data={data} />
            </div>
        </div>
    );
};

export default function SatisfaccionUsuariaPage() {
    return <SatisfaccionReport />;
}
