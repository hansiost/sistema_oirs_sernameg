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
        nombre: 'Reporte de Tiempos de Respuesta', 
        descripcion: 'Dashboard externo en Looker Studio que analiza los tiempos de gestión y cierre de casos.',
        tipo: 'Dashboard',
        link: 'https://lookerstudio.google.com'
    },
    { 
        id: 'REP-004', 
        nombre: 'Reporte de Satisfacción Usuaria', 
        descripcion: 'Tabla que resume los resultados de las encuestas de satisfacción por cada solicitud respondida.',
        tipo: 'Tabla',
         link: '/backoffice_oirs/reportes/view?id=REP-004'
    },
];
