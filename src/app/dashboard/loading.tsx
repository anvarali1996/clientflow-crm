export default function Loading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-8 w-60 bg-gray-300 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 bg-white rounded-xl p-6"
          >
            <div className="h-4 w-24 bg-gray-200 rounded mb-5" />
            <div className="h-9 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      <div className="h-72 bg-white rounded-xl p-6 space-y-5">
        <div className="h-6 w-40 bg-gray-300 rounded" />

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-12 bg-gray-200 rounded"
          />
        ))}
      </div>
    </div>
  );
}