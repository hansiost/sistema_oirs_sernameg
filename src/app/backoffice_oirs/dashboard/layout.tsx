
'use client';
import React from 'react';
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
import { Building2, LayoutDashboard, BarChart3, Settings, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
    href: '/backoffice_oirs/administracion',
    label: 'Administración',
    icon: Settings,
  },
];

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
              <SidebarMenuItem key={item.href}>
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
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Cerrar Sesión">
                    <Link href="/backoffice_oirs">
                        <LogOut />
                        <span>Cerrar Sesión</span>
                    </Link>
                </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
             <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
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
                        <DropdownMenuItem>admin@sernameg.gob.cl</DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                           <Link href="/backoffice_oirs">
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
