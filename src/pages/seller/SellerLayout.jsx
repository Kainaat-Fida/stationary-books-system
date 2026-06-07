import { Outlet } from "react-router-dom";
import SellerNavbar from "./SellerNavbar";

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNavbar /> {/* Top Navbar */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet /> {/* Render nested pages */}
      </div>
    </div>
  );
}
