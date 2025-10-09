'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Save, KeyRound } from 'lucide-react';

const profileFormSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, 'La clave actual es obligatoria.'),
    newPassword: z.string().min(8, 'La nueva clave debe tener al menos 8 caracteres.'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Las nuevas claves no coinciden.",
    path: ["confirmPassword"],
});


export default function PerfilPage() {
    const { toast } = useToast();

    const profileForm = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            nombre: 'Ana Contreras',
        },
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
        console.log('Updating profile:', values);
        toast({
            title: 'Perfil Actualizado',
            description: 'Su nombre ha sido actualizado correctamente.',
        });
    };
    
    const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
        console.log('Changing password');
        toast({
            title: 'Clave Actualizada',
            description: 'Su clave ha sido cambiada correctamente.',
        });
        passwordForm.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Mi Perfil</h1>
                <p className="text-muted-foreground">
                    Actualice su información personal y su clave de acceso.
                </p>
            </div>

            <Card>
                 <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>
                                Modifique su nombre de usuario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <FormLabel>Email</FormLabel>
                                <Input value="admin@sernameg.gob.cl" disabled />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    El email no puede ser modificado.
                                </p>
                            </div>
                            <FormField
                                control={profileForm.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Su nombre completo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card>
                 <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                        <CardHeader>
                            <CardTitle>Cambiar Clave</CardTitle>
                            <CardDescription>
                                Para mayor seguridad, le recomendamos cambiar su clave periódicamente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Clave Actual</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nueva Clave</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Nueva Clave</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                {passwordForm.formState.isSubmitting && <Icons.Loading className="mr-2" />}
                                <KeyRound className="mr-2 h-4 w-4" />
                                Actualizar Clave
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
