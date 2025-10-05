
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const sampleData = [
  { id: 'CD-67890', region: 'Valparaíso', tipo: 'Reclamo', estado: 'En proceso', fecha: '2025-07-27' },
  { id: 'EF-54321', region: 'Biobío', tipo: 'Queja', estado: 'Respondida', fecha: '2025-07-25' },
  { id: 'GH-98765', region: 'La Araucanía', tipo: 'Sugerencia', estado: 'Cerrada', fecha: '2025-07-24' },
  { id: 'IJ-11223', region: 'Los Lagos', tipo: 'Felicitacion', estado: 'Cerrada', fecha: '2025-07-23' },
  { id: 'KL-33445', region: 'Arica y Parinacota', tipo: 'Consulta', estado: 'Ingresada', fecha: '2025-07-22' },
];

export default function SampleTableReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte Tabular de Ejemplo</CardTitle>
        <CardDescription>Este es un ejemplo de un reporte que muestra los datos en formato de tabla.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Solicitud</TableHead>
              <TableHead>Región</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.region}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>
                  <Badge variant={item.estado === 'Respondida' || item.estado === 'Cerrada' ? 'secondary' : 'default'}>
                    {item.estado}
                  </Badge>
                </TableCell>
                <TableCell>{item.fecha}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
