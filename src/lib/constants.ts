export const REQUEST_TYPES = [
  'Reclamo',
  'Consulta',
  'Sugerencia',
  'Queja',
  'Felicitacion',
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];

export const TOPICS: Record<RequestType, string[]> = {
  Reclamo: [
    'Violencia intrafamiliar',
    'Maltrato laboral',
    'Discriminación de género',
    'Atención deficiente en servicio público',
    'Publicidad sexista',
    'Otro',
  ],
  Consulta: [
    'Derechos de la mujer',
    'Programas de apoyo y orientación',
    'Asesoría legal',
    'Salud sexual y reproductiva',
    'Participación política y social',
    'Otro',
  ],
  Sugerencia: [
    'Mejora de servicios de atención',
    'Nuevos programas o talleres',
    'Campañas de difusión y sensibilización',
    'Mejorar accesibilidad de la información',
    'Colaboración con otras entidades',
    'Otro',
  ],
  Queja: [
    'Conducta de funcionario/a',
    'Demora excesiva en la atención',
    'Falta de respuesta a solicitud previa',
    'Procedimientos institucionales confusos',
    'Infraestructura inadecuada',
    'Otro',
  ],
  Felicitacion: [
    'Buena atención recibida',
    'Agradecimiento a funcionario/a o equipo',
    'Efectividad de un programa o servicio',
    'Iniciativa destacada',
    'Material de difusión útil',
    'Otro',
  ],
};

export const REGIONES_CHILE = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  'Libertador General Bernardo O\'Higgins',
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén del General Carlos Ibáñez del Campo',
  'Magallanes y de la Antártica Chilena',
] as const;
