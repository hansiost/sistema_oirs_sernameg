
'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartData = [
  { region: 'Arica', solicitudes: 186 },
  { region: 'Tarapacá', solicitudes: 305 },
  { region: 'Antofagasta', solicitudes: 237 },
  { region: 'Atacama', solicitudes: 173 },
  { region: 'Coquimbo', solicitudes: 209 },
  { region: 'Valparaíso', solicitudes: 450 },
  { region: 'Metropolitana', solicitudes: 890 },
  { region: 'O\'Higgins', solicitudes: 320 },
  { region: 'Maule', solicitudes: 280 },
  { region: 'Ñuble', solicitudes: 190 },
  { region: 'Biobío', solicitudes: 510 },
  { region: 'La Araucanía', solicitudes: 380 },
  { region: 'Los Ríos', solicitudes: 210 },
  { region: 'Los Lagos', solicitudes: 350 },
  { region: 'Aysén', solicitudes: 90 },
  { region: 'Magallanes', solicitudes: 120 },
];

const chartConfig = {
  solicitudes: {
    label: 'Solicitudes',
    color: 'hsl(var(--primary))',
  },
};

export default function SampleDashboardReport() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Solicitudes por Región</CardTitle>
                <CardDescription>Distribución de solicitudes a nivel nacional.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
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
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="solicitudes" fill="var(--color-solicitudes)" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Tipos de Solicitud</CardTitle>
                <CardDescription>Distribución por tipo de solicitud.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{
                    'Consulta': { label: 'Consulta', color: 'hsl(var(--chart-1))'},
                    'Reclamo': { label: 'Reclamo', color: 'hsl(var(--chart-2))' },
                    'Sugerencia': { label: 'Sugerencia', color: 'hsl(var(--chart-3))' },
                    'Queja': { label: 'Queja', color: 'hsl(var(--chart-4))' },
                    'Felicitacion': { label: 'Felicitación', color: 'hsl(var(--chart-5))' },
                }} className="min-h-[300px] w-full">
                    <BarChart layout="vertical" data={[
                        { type: 'Consulta', count: 450 },
                        { type: 'Reclamo', count: 210 },
                        { type: 'Sugerencia', count: 150 },
                        { type: 'Queja', count: 80 },
                        { type: 'Felicitacion', count: 50 },
                    ]} accessibilityLayer>
                         <CartesianGrid horizontal={false} />
                        <YAxis dataKey="type" type="category" tickLine={false} axisLine={false} />
                        <XAxis type="number" hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="count" layout="vertical" radius={4}>
                            <Bar dataKey="count" fill="var(--color-Consulta)" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
