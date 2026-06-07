import React, { useState } from "react";
import { User, Package, ShoppingCart, UserCheck, LogOut, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function SellerNavbar({ activeTab, setActiveTab }) {
  const dispatch = useDispatch();
  const { user, userData } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  const tabs = [
    { label: "Profile", key: "profile", icon: <User className="w-5 h-5" /> },
    { label: "Add Product", key: "addProduct", icon: <Package className="w-5 h-5" /> },
    { label: "Products", key: "products", icon: <ShoppingCart className="w-5 h-5" /> },
    { label: "Manage Orders", key: "manageOrders", icon: <UserCheck className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-700">📚 Stationery Books</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition hover:bg-gray-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 space-y-2 bg-white border-t border-gray-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg font-medium transition "
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
