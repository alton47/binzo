import Card from "@/components/ui/Card";

export default function PosPanel() {
  return (
    <Card>
      <p className="text-sm `text-var(--text-secondary)` mb-4">Point of Sale</p>

      <button className="btn-primary w-full">Complete Sale</button>
    </Card>
  );
}
