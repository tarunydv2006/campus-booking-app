const Skeleton = ({ rows = 6 }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="glass skeleton-shimmer h-48 rounded-lg" />
    ))}
  </div>
);

export default Skeleton;
