const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <span>Admin</span>

        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;