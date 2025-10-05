'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function ArbolTemasPage() {
  // En una aplicación real, esto sería una interfaz más compleja para un árbol.
  // Por ahora, usamos el layout genérico como placeholder.
  return (
    <MaintainerPageLayout
      title="Árbol de Temas"
      description="Gestione los temas y subtemas de las solicitudes."
      initialData={mockMaintainers.arbolTemas}
      columns={[{ accessorKey: "value", header: "Tema" }]}
      dataType="arbolTemas"
    />
  );
}
