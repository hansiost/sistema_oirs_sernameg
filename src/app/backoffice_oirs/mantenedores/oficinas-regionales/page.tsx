'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function OficinasRegionalesPage() {
  return (
    <MaintainerPageLayout
      title="Oficinas Regionales"
      description="Administre las oficinas regionales disponibles en el sistema."
      initialData={mockMaintainers.oficinasRegionales}
      columns={[{ accessorKey: "value", header: "Oficina Regional" }]}
      dataType="oficinasRegionales"
    />
  );
}
