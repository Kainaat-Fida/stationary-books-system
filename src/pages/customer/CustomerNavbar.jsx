import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  ChevronDown, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ClipboardList,
  LogOut
} from "lucide-react";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const { user, userData } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.customer.cart);
  const count = cart?.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 0;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userData");
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/customer" className="flex items-center gap-3">
            <div className="text-3xl">📚</div>
            <span className="text-lg font-bold text-blue-700">
              Stationery Books System
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">

            {/* Orders */}
            <Link
              to="/customer/orders"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition"
            >
              <ClipboardList className="w-5 h-5" />
              Orders
            </Link>

            {/* Cart */}
            <Link
              to="/customer/cart"
              className="relative flex items-center gap-2 px-3 py-2 hover:text-blue-700 transition"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Cart</span>

              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                  {count}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {userData?.name || user?.email?.split("@")[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 space-y-2 bg-white border-t border-gray-200 shadow-sm">

          {/* Orders */}
          <Link
            to="/customer/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="
              flex items-center gap-3
              w-full px-3 py-3 rounded-lg
              text-gray-700 font-medium
              bg-gray-50 hover:bg-gray-100
              transition
            "
          >
            <ClipboardList className="w-5 h-5" />
            <span>Orders</span>
          </Link>

          {/* Cart */}
          <Link
            to="/customer/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="
              flex items-center gap-3
              w-full px-3 py-3 rounded-lg
              text-gray-700 font-medium
              bg-gray-50 hover:bg-gray-100
              transition
              relative
            "
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>

            {count > 0 && (
              <span className="absolute right-3 top-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3
              w-full px-3 py-3 rounded-lg
              text-red-500 font-medium
              bg-gray-50 hover:bg-gray-100
              transition
            "
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>

        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;
