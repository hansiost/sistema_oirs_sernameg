export type User = {
    id: string;
    rut: string;
    nombre: string;
    email: string;
    oficina: string;
    estado: 'Activo' | 'Inactivo';
    perfil: 'Administrador' | 'Encargado OIRS Regional' | 'Encargado OIRS Nacional';
}

export const mockUsers: User[] = [
    { id: '1', rut: '12.345.678-9', nombre: 'Ana Contreras', email: 'ana.contreras@sernameg.gob.cl', oficina: 'Metropolitana de Santiago', estado: 'Activo', perfil: 'Administrador' },
    { id: '2', rut: '11.478.406-0', nombre: 'Juan Soto', email: 'juan.soto@sernameg.gob.cl', oficina: 'Valparaíso', estado: 'Activo', perfil: 'Encargado OIRS Regional' },
    { id: '3', rut: '10.987.654-3', nombre: 'María González', email: 'maria.gonzalez@sernameg.gob.cl', oficina: 'Biobío', estado: 'Inactivo', perfil: 'Encargado OIRS Regional' },
    { id: '4', rut: '13.456.789-K', nombre: 'Carlos López', email: 'carlos.lopez@sernameg.gob.cl', oficina: 'Nivel Central', estado: 'Activo', perfil: 'Encargado OIRS Nacional' },
    { id: '5', rut: '14.567.890-1', nombre: 'Luisa Martinez', email: 'luisa.martinez@sernameg.gob.cl', oficina: 'Los Lagos', estado: 'Activo', perfil: 'Encargado OIRS Regional' },
];

// --- Permisos ---
export type Profile = 'Administrador' | 'Encargado OIRS Regional' | 'Encargado OIRS Nacional';
export type Permission = { id: string, label: string };
export type PermissionCategory = { id: string, label: string, permissions: Permission[] };

export const mockPermissions: Record<Profile, string[]> = {
  Administrador: [
    'solicitudes:crear-cualquier-region',
    'solicitudes:modificar-tipo',
    'reportes:crear-editar',
    'reportes:ver',
    'documentos:ver-descargar',
    'documentos:gestionar',
    'contactos:gestionar-cualquier-region',
    'admin:gestionar-usuarios',
    'admin:gestionar-permisos',
    'mantenedores:tipos-solicitud',
    'mantenedores:arbol-temas',
    'mantenedores:vias-ingreso',
    'mantenedores:oficinas-regionales',
    'mantenedores:genero',
    'mantenedores:pueblos-originarios',
    'mantenedores:estados-solicitud',
    'mantenedores:resultado-atencion',
    'mantenedores:tipo-resolucion',
    'mantenedores:preguntas-frecuentes',
  ],
  'Encargado OIRS Nacional': [
    'solicitudes:crear-cualquier-region',
    'reportes:ver',
    'documentos:ver-descargar',
  ],
  'Encargado OIRS Regional': [
    'reportes:ver',
    'documentos:ver-descargar',
  ],
};
