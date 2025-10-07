
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import { format, startOfYear, endOfYear } from 'date-fns';
import { Pie, PieChart, Cell, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip } from 'recharts';
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
import { ArrowLeft, FileDown, Calendar as CalendarIcon, FilterX, Table2, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { REGIONES_CHILE, REQUEST_TYPES } from '@/lib/constants';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type RegionSummary = {
  region: string;
  total: number;
  ingresada: number;
  enProceso: number;
  respondida: number;
  cerrada: number;
  cancelada: number;
};

// Generar datos de ejemplo
const generateMockData = (): RegionSummary[] => {
  return REGIONES_CHILE.map(region => ({
    region,
    total: Math.floor(Math.random() * 200) + 20,
    ingresada: Math.floor(Math.random() * 30),
    enProceso: Math.floor(Math.random() * 50),
    respondida: Math.floor(Math.random() * 80),
    cerrada: Math.floor(Math.random() * 40),
    cancelada: Math.floor(Math.random() * 10),
  }));
};

type RegionTypeSummary = {
    region: string;
    total: number;
    Reclamo: number;
    Consulta: number;
    Sugerencia: number;
    Queja: number;
    Felicitacion: number;
}

const generateMockTypeData = (): RegionTypeSummary[] => {
    return REGIONES_CHILE.map(region => {
        const reclamo = Math.floor(Math.random() * 40);
        const consulta = Math.floor(Math.random() * 70);
        const sugerencia = Math.floor(Math.random() * 30);
        const queja = Math.floor(Math.random() * 20);
        const felicitacion = Math.floor(Math.random() * 10);
        return {
            region,
            total: reclamo + consulta + sugerencia + queja + felicitacion,
            Reclamo: reclamo,
            Consulta: consulta,
            Sugerencia: sugerencia,
            Queja: queja,
            Felicitacion: felicitacion
        }
    });
};


const chartConfig = {
  total: { label: 'Total', color: 'hsl(var(--chart-1))' },
  ingresada: { label: 'Ingresadas', color: 'hsl(var(--chart-1))' },
  enProceso: { label: 'En Proceso', color: 'hsl(var(--chart-2))' },
  respondida: { label: 'Respondidas', color: 'hsl(var(--chart-3))' },
  cerrada: { label: 'Cerradas', color: 'hsl(var(--chart-4))' },
  cancelada: { label: 'Canceladas', color: 'hsl(var(--chart-5))' },
  Reclamo: { label: 'Reclamo', color: 'hsl(var(--chart-1))' },
  Consulta: { label: 'Consulta', color: 'hsl(var(--chart-2))' },
  Sugerencia: { label: 'Sugerencia', color: 'hsl(var(--chart-3))' },
  Queja: { label: 'Queja', color: 'hsl(var(--chart-4))' },
  Felicitacion: { label: 'Felicitación', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;


const ResumenNacionalPieChart = ({ data, dateRange }: { data: Omit<RegionSummary, 'region' | 'total'>, dateRange?: DateRange }) => {
    const chartData = Object.entries(data)
        .filter(([key]) => key in chartConfig && key !== 'total')
        .map(([key, value]) => ({
            name: chartConfig[key as keyof typeof chartConfig].label,
            value: value,
            fill: chartConfig[key as keyof typeof chartConfig].color,
        }));
    
    const dateRangeString = dateRange?.from && dateRange?.to 
        ? `Datos desde ${format(dateRange.from, "dd/MM/yy")} hasta ${format(dateRange.to, "dd/MM/yy")}.`
        : 'Datos para todo el período.';


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Distribución Nacional por Estado
                </CardTitle>
                <CardDescription>
                    {dateRangeString}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[350px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            strokeWidth={5}
                        >
                            {chartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend
                            verticalAlign="middle"
                            layout="vertical"
                            align="right"
                            iconSize={10}
                            wrapperStyle={{
                                paddingLeft: '20px',
                                lineHeight: '24px',
                            }}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

const ResumenRegionalBarChart = ({ data, dateRange }: { data: RegionSummary[], dateRange?: DateRange }) => {
    const chartData = data.map(item => ({
        region: item.region.length > 20 ? `${item.region.substring(0, 18)}...` : item.region,
        total: item.total
    }));

    const dateRangeString = dateRange?.from && dateRange?.to
        ? `Datos desde ${format(dateRange.from, "dd/MM/yy")} hasta ${format(dateRange.to, "dd/MM/yy")}.`
        : 'Datos para todo el período.';
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Total Solicitudes por Región
                </CardTitle>
                <CardDescription>
                    {dateRangeString}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
                    <BarChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="region"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

const ResumenRegionalPorEstadoBarChart = ({ data, dateRange }: { data: RegionSummary[], dateRange?: DateRange }) => {
    const chartData = data.map(item => ({
        region: item.region,
        ...item
    }));

    const dateRangeString = dateRange?.from && dateRange?.to
        ? `Datos desde ${format(dateRange.from, "dd/MM/yy")} hasta ${format(dateRange.to, "dd/MM/yy")}.`
        : 'Datos para todo el período.';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Desglose de Solicitudes por Región y Estado
                </CardTitle>
                <CardDescription>
                    {dateRangeString}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis 
                            dataKey="region"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} cursor={false} />
                        <Legend />
                        <Bar dataKey="ingresada" stackId="a" fill="var(--color-ingresada)" radius={0} />
                        <Bar dataKey="enProceso" stackId="a" fill="var(--color-enProceso)" radius={0} />
                        <Bar dataKey="respondida" stackId="a" fill="var(--color-respondida)" radius={0} />
                        <Bar dataKey="cerrada" stackId="a" fill="var(--color-cerrada)" radius={0} />
                        <Bar dataKey="cancelada" stackId="a" fill="var(--color-cancelada)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

const ResumenRegionalPorTipoBarChart = ({ data, dateRange }: { data: RegionTypeSummary[], dateRange?: DateRange }) => {
    const chartData = data.map(item => ({
        region: item.region,
        ...item
    }));

    const dateRangeString = dateRange?.from && dateRange?.to
        ? `Datos desde ${format(dateRange.from, "dd/MM/yy")} hasta ${format(dateRange.to, "dd/MM/yy")}.`
        : 'Datos para todo el período.';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Desglose de Solicitudes por Región y Tipo
                </CardTitle>
                <CardDescription>
                    {dateRangeString}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="region"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} cursor={false} />
                        <Legend />
                        <Bar dataKey="Reclamo" stackId="a" fill="var(--color-Reclamo)" radius={0} />
                        <Bar dataKey="Consulta" stackId="a" fill="var(--color-Consulta)" radius={0} />
                        <Bar dataKey="Sugerencia" stackId="a" fill="var(--color-Sugerencia)" radius={0} />
                        <Bar dataKey="Queja" stackId="a" fill="var(--color-Queja)" radius={0} />
                        <Bar dataKey="Felicitacion" stackId="a" fill="var(--color-Felicitacion)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

const ResumenSolicitudesReport = () => {
    const { toast } = useToast();
    const [data] = useState<RegionSummary[]>(generateMockData());
    const [typeData] = useState<RegionTypeSummary[]>(generateMockTypeData());
    const [date, setDate] = useState<DateRange | undefined>({
        from: startOfYear(new Date(2025, 0, 1)),
        to: endOfYear(new Date(2025, 11, 31)),
      });

    const totals = {
        total: data.reduce((acc, item) => acc + item.total, 0),
        ingresada: data.reduce((acc, item) => acc + item.ingresada, 0),
        enProceso: data.reduce((acc, item) => acc + item.enProceso, 0),
        respondida: data.reduce((acc, item) => acc + item.respondida, 0),
        cerrada: data.reduce((acc, item) => acc + item.cerrada, 0),
        cancelada: data.reduce((acc, item) => acc + item.cancelada, 0),
    };
    
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
                                <Table2 className="h-6 w-6 text-primary" />
                                Reporte: Resumen de Solicitudes por Región
                            </CardTitle>
                            <CardDescription>
                                Total de solicitudes por región, desglosado por estado.
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
                                    <TableHead className="text-right font-bold">Total</TableHead>
                                    <TableHead className="text-right">Ingresada</TableHead>
                                    <TableHead className="text-right">En Proceso</TableHead>
                                    <TableHead className="text-right">Respondida</TableHead>
                                    <TableHead className="text-right">Cerrada</TableHead>
                                    <TableHead className="text-right">Cancelada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.region}>
                                    <TableCell className="font-medium">{item.region}</TableCell>
                                    <TableCell className="text-right font-bold">{item.total}</TableCell>
                                    <TableCell className="text-right">{item.ingresada}</TableCell>
                                    <TableCell className="text-right">{item.enProceso}</TableCell>
                                    <TableCell className="text-right">{item.respondida}</TableCell>
                                    <TableCell className="text-right">{item.cerrada}</TableCell>
                                    <TableCell className="text-right">{item.cancelada}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-muted/50 hover:bg-muted/80">
                                    <TableHead className="font-bold">Total Nacional</TableHead>
                                    <TableHead className="text-right font-bold">{totals.total}</TableHead>
                                    <TableHead className="text-right font-bold">{totals.ingresada}</TableHead>
                                    <TableHead className="text-right font-bold">{totals.enProceso}</TableHead>
                                    <TableHead className="text-right font-bold">{totals.respondida}</TableHead>
                                    <TableHead className="text-right font-bold">{totals.cerrada}</TableHead>
                                    <TableHead className="text-right font-bold">{totals.cancelada}</TableHead>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResumenNacionalPieChart data={totals} dateRange={date} />
                <ResumenRegionalBarChart data={data} dateRange={date} />
            </div>
            <div className="mt-6">
                <ResumenRegionalPorEstadoBarChart data={data} dateRange={date} />
            </div>
             <div className="mt-6">
                <ResumenRegionalPorTipoBarChart data={typeData} dateRange={date} />
            </div>
        </div>
    );
};

export default function ResumenSolicitudesPage() {
    return <ResumenSolicitudesReport />;
}
