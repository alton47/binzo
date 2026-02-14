import Card from "@/components/ui/Card";

export default function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <Card>
      <p className="text-sm `text-(--text-secondary)`">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </Card>
  );
}
