import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Menu,
    X,
    ChevronDown,
    User,
    LogOut
} from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminNavbar() {
    const navigate = useNavigate();
    const { user, userData } = useSelector((state) => state.auth);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("userData");
        navigate("/signin");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const menuItems = [
        { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin" },
        { label: "Sellers", icon: <Users className="w-5 h-5" />, path: "/admin/sellers" },
        { label: "Customers", icon: <Users className="w-5 h-5" />, path: "/admin/customers" },
        { label: "Orders", icon: <ShoppingCart className="w-5 h-5" />, path: "/admin/orders" },
    ];

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

                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 text-sm font-medium transition px-3 py-2`
                                }
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ))}

                        {/* Profile Dropdown (same as customer) */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                            >
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {userData?.name || user?.email?.split("@")[0]} (Admin)
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

            {/* Mobile Menu (100% same style as customer) */}
            {mobileMenuOpen && (
                <div className="md:hidden px-4 py-4 space-y-2 bg-white border-t border-gray-200 shadow-sm">

                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `
                flex items-center gap-3
                w-full px-3 py-3 rounded-lg
                font-medium `
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="
              flex items-center gap-3
              w-full px-3 py-3 rounded-lg
              text-gray-700 font-medium
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
}
