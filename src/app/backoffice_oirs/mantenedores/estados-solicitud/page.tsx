'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function EstadosSolicitudPage() {
  return (
    <MaintainerPageLayout
      title="Estados de Solicitud"
      description="Administre los posibles estados de una solicitud."
      initialData={mockMaintainers.estadosSolicitud}
      columns={[{ accessorKey: "value", header: "Estado" }]}
      dataType="estadosSolicitud"
    />
  );
}
