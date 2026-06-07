import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Sellers from "../pages/admin/Sellers";
import SellerProducts from "../pages/admin/SellerProducts";
import Customers from "../pages/admin/Customers";
import Orders from "../pages/admin/Orders";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* /admin */}
        <Route index element={<AdminDashboard />} />

        {/* /admin/sellers */}
        <Route path="sellers" element={<Sellers />} />

        {/* /admin/seller/:id */}
        <Route path="seller/:id" element={<SellerProducts />} />

        {/* /admin/customers */}
        <Route path="customers" element={<Customers />} />

        {/* /admin/orders */}
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}
