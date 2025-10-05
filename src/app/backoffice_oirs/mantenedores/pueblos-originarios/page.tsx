'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function PueblosOriginariosPage() {
  return (
    <MaintainerPageLayout
      title="Pueblos Originarios"
      description="Administre las opciones de pueblos originarios disponibles."
      initialData={mockMaintainers.pueblosOriginarios}
      columns={[{ accessorKey: "value", header: "Pueblo Originario" }]}
      dataType="pueblosOriginarios"
    />
  );
}
