
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="animate-gradient bg-gradient-to-r from-gray-900 to-purple-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl flex items-center gap-2 hover:opacity-90 transition">
            🏨 MERN Hotels
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">
              Home
            </Link>
            <Link to="/rooms" className="hover:text-blue-200 transition">
              Browse Rooms
            </Link>
            <Link to="/offers" className="hover:text-blue-200 transition">
              Special Offers
            </Link>

            {token ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition flex items-center gap-1">
                  <User size={18} />
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="hover:text-blue-200 transition">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:text-blue-200 py-2 transition">
              Home
            </Link>
            <Link to="/rooms" className="block hover:text-blue-200 py-2 transition">
              Browse Rooms
            </Link>
            <Link to="/offers" className="block hover:text-blue-200 py-2 transition">
              Special Offers
            </Link>

            {token ? (
              <>
                <Link to="/dashboard" className="block hover:text-blue-200 py-2 transition">
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block hover:text-blue-200 py-2 transition">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-blue-200 py-2 transition">
                  Login
                </Link>
                <Link to="/register" className="block bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

