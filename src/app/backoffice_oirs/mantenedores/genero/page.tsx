'use client';
import MaintainerPageLayout from "../maintainer-page-layout";
import { mockMaintainers } from "@/lib/mock-data-maintainers";

export default function GeneroPage() {
  return (
    <MaintainerPageLayout
      title="Género"
      description="Administre las opciones de género disponibles en los formularios."
      initialData={mockMaintainers.genero}
      columns={[{ accessorKey: "value", header: "Género" }]}
      dataType="genero"
    />
  );
}
