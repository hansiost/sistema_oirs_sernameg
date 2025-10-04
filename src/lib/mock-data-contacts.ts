export type Contacto = {
    id: string;
    region: string;
    nombre: string;
    cargo: string;
    institucion: string;
}

export const mockContacts: Contacto[] = [
    { id: '1', region: 'Metropolitana de Santiago', nombre: 'Carla Rojas', cargo: 'Coordinadora Centro de la Mujer', institucion: 'Municipalidad de Santiago' },
    { id: '2', region: 'Valparaíso', nombre: 'Roberto Pérez', cargo: 'Abogado Jefe', institucion: 'Consultorio Jurídico Móvil' },
    { id: '3', region: 'Biobío', nombre: 'Jimena Fuentes', cargo: 'Directora Regional', institucion: 'Prodemu' },
    { id: '4', region: 'La Araucanía', nombre: 'Manuel Torres', cargo: 'Fiscal', institucion: 'Fiscalía Regional' },
    { id: '5', region: 'Metropolitana de Santiago', nombre: 'Sofía Castro', cargo: 'Psicóloga', institucion: 'Casa de Acogida "La Morada"' },
];
