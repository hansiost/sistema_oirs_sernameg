
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
        nombre: 'Detalle de Solicitudes', 
        descripcion: 'Tabla con el detalle de todas las solicitudes del año, con filtros y opción de descarga.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view/detalle-solicitudes'
    },
    {
        id: 'REP-002',
        nombre: 'Resumen de Solicitudes por Región y Nacional',
        descripcion: 'Tabla y gráficos con el total de solicitudes por región y su desglose por estado y tipo.',
        tipo: 'Dashboard',
        link: '/backoffice_oirs/reportes/view/resumen-solicitudes',
    },
     {
        id: 'REP-003',
        nombre: 'Tiempos de Respuesta por Tipo de Solicitud',
        descripcion: 'Tabla con el tiempo de respuesta promedio por tipo de solicitud para cada región.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view/tiempos-respuesta',
    },
    { 
        id: 'REP-004', 
        nombre: 'Reporte de Satisfacción Usuaria', 
        descripcion: 'Análisis del nivel de satisfacción de las usuarias por región, basado en las encuestas de atención.',
        tipo: 'Tabla',
        link: '/backoffice_oirs/reportes/view/satisfaccion-usuaria'
    },
];
