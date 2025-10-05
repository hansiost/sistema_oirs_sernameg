'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function ViasIngresoPage() {
  return (
    <MaintainerPageLayout
      title="Vías de Ingreso"
      description="Administre las vías de ingreso por las cuales se puede registrar una solicitud."
      initialData={mockMaintainers.viasIngreso}
      columns={[{ accessorKey: "value", header: "Vía de Ingreso" }]}
      dataType="viasIngreso"
    />
  );
}
