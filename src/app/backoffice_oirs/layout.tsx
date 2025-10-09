'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Building2, LayoutDashboard, BarChart3, Settings, LogOut, UserCircle, KeyRound, ChevronDown, Users, FileText, Network, Waypoints, Wrench, Building, VenetianMask, Feather, ListChecks, CheckCheck, FileCheck, Database, Files, BookUser, HelpCircle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    href: '/backoffice_oirs/dashboard',
    label: 'Gestión de Solicitudes',
    icon: LayoutDashboard,
  },
  {
    href: '/backoffice_oirs/reportes',
    label: 'Reportes',
    icon: BarChart3,
  },
  {
    href: '/backoffice_oirs/documentos',
    label: 'Documentos',
    icon: Files,
  },
  {
    href: '/backoffice_oirs/contactos',
    label: 'Contactos',
    icon: BookUser,
  },
];

const adminSubMenuItems = [
    { href: '/backoffice_oirs/administracion/usuarios', label: 'Usuarios', icon: Users },
    { href: '/backoffice_oirs/administracion/permisos', label: 'Permisos', icon: KeyRound },
];

const maintainerSubMenuItems = [
    { href: '/backoffice_oirs/mantenedores/tipos-solicitud', label: 'Tipos de Solicitudes', icon: FileText },
    { href: '/backoffice_oirs/mantenedores/arbol-temas', label: 'Árbol de Temas', icon: Network },
    { href: '/backoffice_oirs/mantenedores/vias-ingreso', label: 'Vías de Ingreso', icon: Waypoints },
    { href: '/backoffice_oirs/mantenedores/oficinas-regionales', label: 'Oficinas Regionales', icon: Building },
    { href: '/backoffice_oirs/mantenedores/genero', label: 'Género', icon: VenetianMask },
    { href: '/backoffice_oirs/mantenedores/pueblos-originarios', label: 'Pueblos Originarios', icon: Feather },
    { href: '/backoffice_oirs/mantenedores/estados-solicitud', label: 'Estados de Solicitud', icon: ListChecks },
    { href: '/backoffice_oirs/mantenedores/resultado-atencion', label: 'Resultado de Atención', icon: CheckCheck },
    { href: '/backoffice_oirs/mantenedores/tipo-resolucion', label: 'Tipo Resolución', icon: FileCheck },
    { href: '/backoffice_oirs/mantenedores/preguntas-frecuentes', label: 'Preguntas Frecuentes', icon: HelpCircle },
];


export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isAdministracionActive = pathname.startsWith('/backoffice_oirs/administracion');
  const [isAdministracionOpen, setIsAdministracionOpen] = useState(isAdministracionActive);

  const isMantenedoresActive = pathname.startsWith('/backoffice_oirs/mantenedores');
  const [isMantenedoresOpen, setIsMantenedoresOpen] = useState(isMantenedoresActive);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center text-primary-foreground bg-primary rounded-full p-2">
                <Building2 className="h-6 w-6" />
            </div>
            <span className="font-semibold text-lg">OIRS SERNAMEG</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <Collapsible open={isAdministracionOpen} onOpenChange={setIsAdministracionOpen} asChild>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={isAdministracionActive}
                            className="justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Settings />
                                <span>Administración</span>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isAdministracionOpen && "rotate-180")} />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="pl-8 flex flex-col gap-1 mt-1">
                            {adminSubMenuItems.map((item) => (
                                 <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        (pathname === item.href || (item.href !== '/backoffice_oirs/administracion' && pathname.startsWith(item.href))) && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
            <Collapsible open={isMantenedoresOpen} onOpenChange={setIsMantenedoresOpen} asChild>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={isMantenedoresActive}
                            className="justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Database />
                                <span>Mantenedores</span>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isMantenedoresOpen && "rotate-180")} />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="pl-8 flex flex-col gap-1 mt-1">
                            {maintainerSubMenuItems.map((item) => (
                                 <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        pathname.startsWith(item.href) && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === '/deployment'}
                    tooltip="Despliegue"
                >
                    <Link href="/deployment">
                        <Rocket />
                        <span>Despliegue</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           {/* El botón de cerrar sesión se ha movido al menú de usuario */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
             <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold md:text-xl">Backoffice OIRS - SERNAMEG</h1>
             </div>
             <div className="flex items-center gap-4">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <UserCircle className="h-6 w-6" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/backoffice_oirs/perfil">
                             <UserCircle className="mr-2 h-4 w-4" />
                             <span>Ver Perfil</span>
                           </Link>
                         </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                           <Link href="/login/backoffice">
                             <LogOut className="mr-2 h-4 w-4" />
                             <span>Cerrar sesión</span>
                           </Link>
                         </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
             </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 bg-muted/40">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
