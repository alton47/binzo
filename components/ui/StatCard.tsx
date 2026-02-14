export default function StatCard({ title, value, description }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-(--border-light) card-shadow">
      <p className="text-sm font-medium text-(--text-secondary)">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {description && (
        <p className="text-xs text-green-500 mt-2">{description}</p>
      )}
    </div>
  );
}
