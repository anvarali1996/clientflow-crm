export default function Loading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-8 w-48 bg-gray-300 rounded" />
      <div className="bg-white rounded-xl p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-12 bg-gray-200 rounded"
          />
        ))}
      </div>
    </div>
  );
}