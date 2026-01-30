export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-white/10 rounded-lg w-3/4 mb-4"></div>
      <div className="h-4 bg-white/10 rounded w-1/2 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-white/20 rounded flex-1"></div>
              <div className="h-10 bg-white/20 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
