export type Documento = {
    id: string;
    nombre: string;
    descripcion: string;
    fechaCarga: string;
    tipo: 'FileText' | 'FileImage' | 'FileAudio'; // Tipos de íconos de lucide-react
}

export const mockDocuments: Documento[] = [
    { 
        id: 'doc-1', 
        nombre: 'Manual de Procedimientos OIRS', 
        descripcion: 'Documento oficial con los procedimientos estándar para la gestión de solicitudes en la OIRS.',
        fechaCarga: '2025-07-15',
        tipo: 'FileText'
    },
    { 
        id: 'doc-2', 
        nombre: 'Guía de Buenas Prácticas de Atención', 
        descripcion: 'Recomendaciones y guía para funcionarios sobre la atención a la ciudadanía con perspectiva de género.',
        fechaCarga: '2025-06-28',
        tipo: 'FileText'
    },
    { 
        id: 'doc-3', 
        nombre: 'Logo Oficial SERNAMEG', 
        descripcion: 'Logo de la institución en alta resolución para uso en materiales de difusión.',
        fechaCarga: '2025-05-10',
        tipo: 'FileImage'
    },
    { 
        id: 'doc-4', 
        nombre: 'Minuta Reunión de Coordinación', 
        descripcion: 'Resumen y acuerdos de la última reunión de coordinación de encargados OIRS regionales.',
        fechaCarga: '2025-07-20',
        tipo: 'FileText'
    },
    { 
        id: 'doc-5', 
        nombre: 'Audio Campaña Radial Violencia', 
        descripcion: 'Spot radial de la campaña de prevención de violencia contra la mujer.',
        fechaCarga: '2025-04-01',
        tipo: 'FileAudio'
    },
     { 
        id: 'doc-6', 
        nombre: 'Protocolo de Derivación', 
        descripcion: 'Protocolo para la derivación de casos a otras instituciones públicas.',
        fechaCarga: '2025-03-18',
        tipo: 'FileText'
    },
];