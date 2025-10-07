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
        descripcion: 'Tabla y gráficos con el total de solicitudes por región y su desglose por estado y tipo.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view/resumen-solicitudes',
    },
     {
        id: 'REP-005',
        nombre: 'Tiempos de Respuesta por Tipo de Solicitud',
        descripcion: 'Tabla con el tiempo de respuesta promedio por tipo de solicitud para cada región.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view/tiempos-respuesta',
    },
    { 
        id: 'REP-004', 
        nombre: 'Reporte de Satisfacción Usuaria', 
        descripcion: 'Dashboard externo en Looker Studio que analiza los resultados de las encuestas de satisfacción.',
        tipo: 'Dashboard',
        link: 'https://lookerstudio.google.com'
    },
];
