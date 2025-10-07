'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { KeyRound, ShieldCheck, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockPermissions, type Profile, type PermissionCategory } from '@/lib/mock-data';

const profiles: Profile[] = ['Administrador', 'Encargado OIRS Regional', 'Encargado OIRS Nacional'];
const permissionCategories: PermissionCategory[] = [
  { 
    id: 'solicitudes', 
    label: 'Gestión de Solicitudes', 
    permissions: [
      { id: 'solicitudes:crear', label: 'Crear nuevas solicitudes' },
      { id: 'solicitudes:ver-todas', label: 'Ver todas las solicitudes de su región/nacional' },
      { id: 'solicitudes:asignar', label: 'Asignar solicitudes a otros usuarios' },
      { id: 'solicitudes:responder', label: 'Responder y cerrar solicitudes' },
    ]
  },
  {
    id: 'reportes',
    label: 'Reportes',
    permissions: [
      { id: 'reportes:ver', label: 'Ver todos los reportes' },
      { id: 'reportes:crear', label: 'Crear y editar reportes' },
    ]
  },
  {
    id: 'documentos',
    label: 'Documentos',
    permissions: [
        { id: 'documentos:ver', label: 'Ver y descargar documentos' },
        { id: 'documentos:cargar', label: 'Cargar y editar documentos' },
        { id: 'documentos:eliminar', label: 'Eliminar documentos' },
    ]
  },
  {
    id: 'contactos',
    label: 'Contactos',
    permissions: [
        { id: 'contactos:ver', label: 'Ver la red de contactos' },
        { id: 'contactos:gestionar', label: 'Crear y editar contactos' },
    ]
  },
  {
    id: 'administracion',
    label: 'Administración',
    permissions: [
      { id: 'admin:usuarios', label: 'Gestionar usuarios (crear, editar, eliminar)' },
      { id: 'admin:permisos', label: 'Gestionar roles y permisos' },
    ]
  },
  {
    id: 'mantenedores',
    label: 'Mantenedores',
    permissions: [
      { id: 'mantenedores:gestionar', label: 'Gestionar todos los mantenedores del sistema' },
    ]
  }
];

export default function PermisosPage() {
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState<Profile>(profiles[0]);
  const [permissions, setPermissions] = useState(mockPermissions);
  
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions(prev => {
      const newPermissions = new Set(prev[selectedProfile]);
      if (checked) {
        newPermissions.add(permissionId);
      } else {
        newPermissions.delete(permissionId);
      }
      return {
        ...prev,
        [selectedProfile]: Array.from(newPermissions)
      };
    });
  };

  const handleSave = () => {
    // In a real app, this would be an API call
    console.log("Guardando permisos:", { profile: selectedProfile, permissions: permissions[selectedProfile] });
    toast({
      title: 'Permisos Guardados',
      description: `Se han actualizado los permisos para el perfil ${selectedProfile}.`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Columna de Perfiles */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound />
            <span>Perfiles de Usuario</span>
          </CardTitle>
          <CardDescription>
            Seleccione un perfil para ver o editar sus permisos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedProfile} onValueChange={(value) => setSelectedProfile(value as Profile)}>
            {profiles.map(profile => (
              <div key={profile} className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-accent">
                <RadioGroupItem value={profile} id={profile} />
                <Label htmlFor={profile} className="font-medium cursor-pointer flex-1">{profile}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Columna de Permisos */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck />
            <span>Permisos para {selectedProfile}</span>
          </CardTitle>
          <CardDescription>
            Marque las casillas para otorgar acceso a las funcionalidades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {permissionCategories.map(category => (
            <div key={category.id}>
              <h3 className="font-semibold mb-3">{category.label}</h3>
              <div className="space-y-3 pl-2">
                {category.permissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={permissions[selectedProfile].includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                    />
                    <Label htmlFor={permission.id} className="font-normal cursor-pointer">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
        <div className="p-6 pt-0 flex justify-end">
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Permisos
            </Button>
        </div>
      </Card>
    </div>
  );
}
