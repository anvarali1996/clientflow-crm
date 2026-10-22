export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <span className="text-gray-700">
          Admin
        </span>

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}