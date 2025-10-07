export type MaintainerItem = {
    id: string;
    value: string;
};

export type TipoSolicitudItem = {
    id: string;
    value: string;
    tiempoMaximo: number;
    diasCritico: number;
    diasAtencion: number;
};

export type MockMaintainers = {
    tiposSolicitud: TipoSolicitudItem[];
    arbolTemas: MaintainerItem[];
    viasIngreso: MaintainerItem[];
    oficinasRegionales: MaintainerItem[];
    genero: MaintainerItem[];
    pueblosOriginarios: MaintainerItem[];
    estadosSolicitud: MaintainerItem[];
    resultadoAtencion: MaintainerItem[];
    tipoResolucion: MaintainerItem[];
};

export const mockMaintainers: MockMaintainers = {
    tiposSolicitud: [
        { id: 'ts-1', value: 'Reclamo', tiempoMaximo: 20, diasCritico: 5, diasAtencion: 10 },
        { id: 'ts-2', value: 'Consulta', tiempoMaximo: 15, diasCritico: 3, diasAtencion: 7 },
        { id: 'ts-3', value: 'Sugerencia', tiempoMaximo: 20, diasCritico: 5, diasAtencion: 10 },
        { id: 'ts-4', value: 'Queja', tiempoMaximo: 25, diasCritico: 7, diasAtencion: 15 },
        { id: 'ts-5', value: 'Felicitacion', tiempoMaximo: 5, diasCritico: 1, diasAtencion: 3 },
    ],
    arbolTemas: [
        { id: 'at-1', value: 'Derechos de la mujer' },
        { id: 'at-2', value: 'Violencia intrafamiliar' },
        { id: 'at-3', value: 'Atención deficiente' },
    ],
    viasIngreso: [
        { id: 'vi-1', value: 'Presencial' },
        { id: 'vi-2', value: 'Telefónica' },
        { id: 'vi-3', value: 'Web' },
        { id: 'vi-4', value: 'Email' },
        { id: 'vi-5', value: 'Carta' },
    ],
    oficinasRegionales: [
        { id: 'or-1', value: 'Arica y Parinacota' },
        { id: 'or-2', value: 'Tarapacá' },
        { id: 'or-3', value: 'Metropolitana de Santiago' },
    ],
    genero: [
        { id: 'g-1', value: 'Femenino' },
        { id: 'g-2', value: 'Masculino' },
        { id: 'g-3', value: 'No Binario' },
        { id: 'g-4', value: 'Prefiere no decirlo' },
    ],
    pueblosOriginarios: [
        { id: 'po-1', value: 'Ninguno' },
        { id: 'po-2', value: 'Mapuche' },
        { id: 'po-3', value: 'Aimara' },
        { id: 'po-4', value: 'Rapa Nui o Pascuenses' },
    ],
    estadosSolicitud: [
        { id: 'es-1', value: 'Ingresada' },
        { id: 'es-2', value: 'En proceso' },
        { id: 'es-3', value: 'Respondida' },
        { id: 'es-4', value: 'Cerrada' },
        { id: 'es-5', value: 'Cancelada' },
    ],
    resultadoAtencion: [
        { id: 'ra-1', value: 'Respuesta directa' },
        { id: 'ra-2', value: 'Derivación a programa' },
        { id: 'ra-3', value: 'Derivación a otra institución' },
    ],
    tipoResolucion: [
        { id: 'tr-1', value: 'Resolución favorable' },
        { id: 'tr-2', value: 'Resolución no favorable' },
        { id: 'tr-3', value: 'Sin resolución' },
    ],
};
