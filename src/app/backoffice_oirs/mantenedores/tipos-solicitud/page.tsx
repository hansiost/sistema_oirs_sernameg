'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function TiposSolicitudPage() {
  return (
    <MaintainerPageLayout
      title="Tipos de Solicitud"
      description="Administre los tipos de solicitud que los ciudadanos pueden ingresar."
      initialData={mockMaintainers.tiposSolicitud}
      columns={[{ accessorKey: "value", header: "Tipo de Solicitud" }]}
      dataType="tiposSolicitud"
    />
  );
}
