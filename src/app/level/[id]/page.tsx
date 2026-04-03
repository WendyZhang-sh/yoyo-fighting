import LevelPageClient from "./client";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LevelPageClient id={id} />;
}
