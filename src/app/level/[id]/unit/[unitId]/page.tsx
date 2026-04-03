import UnitPageClient from "./client";

export function generateStaticParams() {
  const params = [];
  for (const id of ["1", "2"])
    for (let u = 1; u <= 12; u++) params.push({ id, unitId: String(u) });
  return params;
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;
  return <UnitPageClient id={id} unitId={unitId} />;
}
