export type Reporte = {
    id: string;
    nombre: string;
    descripcion: string;
    tipo: 'Tabla' | 'Dashboard';
    link?: string;
}

export const mockReports: Reporte[] = [
    { 
        id: 'REP-001', 
        nombre: 'Solicitudes por Región', 
        descripcion: 'Reporte tabular que muestra el número de solicitudes ingresadas por cada región en un período determinado.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view?id=REP-001'
    },
    { 
        id: 'REP-002', 
        nombre: 'Dashboard de Tiempos de Respuesta', 
        descripcion: 'Panel visual con gráficos sobre los tiempos promedio de respuesta y resolución de solicitudes.',
        tipo: 'Dashboard',
        link: '/backoffice_oirs/reportes/view?id=REP-002'
    },
    { 
        id: 'REP-003', 
        nombre: 'Tipos de Solicitud más Frecuentes', 
        descripcion: 'Gráfico de barras que muestra la distribución de los tipos de solicitud (Consulta, Reclamo, etc.).',
        tipo: 'Dashboard',
        link: 'https://lookerstudio.google.com'
    },
    { 
        id: 'REP-004', 
        nombre: 'Detalle de Solicitudes Cerradas', 
        descripcion: 'Tabla con el detalle completo de todas las solicitudes que han sido cerradas en el último mes.',
        tipo: 'Tabla'
    },
];
