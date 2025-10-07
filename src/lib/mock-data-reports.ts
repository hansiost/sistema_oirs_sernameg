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
        nombre: 'Dashboard General de Solicitudes', 
        descripcion: 'Panel visual con gráficos sobre los tipos de solicitud y su distribución por región.',
        tipo: 'Dashboard',
        link: '/backoffice_oirs/reportes/view?id=REP-001'
    },
    { 
        id: 'REP-002', 
        nombre: 'Detalle de Solicitudes (Año en curso)', 
        descripcion: 'Tabla con el detalle de todas las solicitudes del año, con filtros y opción de descarga.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view/detalle-solicitudes'
    },
    {
        id: 'REP-003',
        nombre: 'Resumen de Solicitudes por Región y Nacional',
        descripcion: 'Tabla con el total de solicitudes por región, desglosado por estado. Incluye totales nacionales.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view/resumen-solicitudes',
    },
    { 
        id: 'REP-004', 
        nombre: 'Reporte de Satisfacción Usuaria', 
        descripcion: 'Dashboard externo en Looker Studio que analiza los resultados de las encuestas de satisfacción.',
        tipo: 'Dashboard',
        link: 'https://lookerstudio.google.com'
    },
];
