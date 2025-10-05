'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function TipoResolucionPage() {
  return (
    <MaintainerPageLayout
      title="Tipo de Resolución"
      description="Administre los tipos de resolución para las solicitudes."
      initialData={mockMaintainers.tipoResolucion}
      columns={[{ accessorKey: "value", header: "Tipo de Resolución" }]}
      dataType="tipoResolucion"
    />
  );
}
