'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function ResultadoAtencionPage() {
  return (
    <MaintainerPageLayout
      title="Resultado de Atención"
      description="Administre los posibles resultados de la atención de una solicitud."
      initialData={mockMaintainers.resultadoAtencion}
      columns={[{ accessorKey: "value", header: "Resultado" }]}
      dataType="resultadoAtencion"
    />
  );
}
