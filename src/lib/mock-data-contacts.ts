
export type Contacto = {
    id: string;
    region: string;
    nombre: string;
    cargo: string;
    institucion: string;
    email: string;
    fono: string;
}

export const mockContacts: Contacto[] = [
    { id: '1', region: 'Metropolitana de Santiago', nombre: 'Carla Rojas', cargo: 'Coordinadora Centro de la Mujer', institucion: 'Municipalidad de Santiago', email: 'carla.rojas@stgo.cl', fono: '+56212345678' },
    { id: '2', region: 'Valparaíso', nombre: 'Roberto Pérez', cargo: 'Abogado Jefe', institucion: 'Consultorio Jurídico Móvil', email: 'roberto.perez@cajval.cl', fono: '+56328765432' },
    { id: '3', region: 'Biobío', nombre: 'Jimena Fuentes', cargo: 'Directora Regional', institucion: 'Prodemu', email: 'jimena.fuentes@prodemu.cl', fono: '+56413456789' },
    { id: '4', region: 'La Araucanía', nombre: 'Manuel Torres', cargo: 'Fiscal', institucion: 'Fiscalía Regional', email: 'manuel.torres@minpublico.cl', fono: '+56459876543' },
    { id: '5', region: 'Metropolitana de Santiago', nombre: 'Sofía Castro', cargo: 'Psicóloga', institucion: 'Casa de Acogida "La Morada"', email: 'sofia.castro@lamorada.org', fono: '+56287654321' },
];
