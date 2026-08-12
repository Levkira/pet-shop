export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="aspect-square bg-sand" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-2/3 rounded bg-sand" />
        <div className="h-3 w-full rounded bg-sand" />
        <div className="h-3 w-5/6 rounded bg-sand" />
        <div className="mt-1 h-9 w-full rounded-full bg-sand" />
      </div>
    </div>
  );
}
