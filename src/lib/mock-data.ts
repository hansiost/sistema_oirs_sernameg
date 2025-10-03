export type User = {
    id: string;
    rut: string;
    nombre: string;
    email: string;
    oficina: string;
    estado: 'Activo' | 'Inactivo';
    perfil: 'Administrador' | 'Encargado OIRS' | 'Funcionario';
}

export const mockUsers: User[] = [
    { id: '1', rut: '12.345.678-9', nombre: 'Ana Contreras', email: 'ana.contreras@sernameg.gob.cl', oficina: 'Metropolitana de Santiago', estado: 'Activo', perfil: 'Administrador' },
    { id: '2', rut: '11.478.406-0', nombre: 'Juan Soto', email: 'juan.soto@sernameg.gob.cl', oficina: 'Valparaíso', estado: 'Activo', perfil: 'Encargado OIRS' },
    { id: '3', rut: '10.987.654-3', nombre: 'María González', email: 'maria.gonzalez@sernameg.gob.cl', oficina: 'Biobío', estado: 'Inactivo', perfil: 'Funcionario' },
    { id: '4', rut: '13.456.789-K', nombre: 'Carlos López', email: 'carlos.lopez@sernameg.gob.cl', oficina: 'La Araucanía', estado: 'Activo', perfil: 'Funcionario' },
    { id: '5', rut: '14.567.890-1', nombre: 'Luisa Martinez', email: 'luisa.martinez@sernameg.gob.cl', oficina: 'Los Lagos', estado: 'Activo', perfil: 'Encargado OIRS' },
];
