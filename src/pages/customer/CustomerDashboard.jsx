// src/pages/customer/CustomerDashboard.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";
import ViewProducts from "./ViewProducts";
import ViewShop from "./ViewShop";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderHistory from "./OrderHistory";

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Navigate to="products" replace />} />
          <Route path="products" element={<ViewProducts />} />
          <Route path="shop/:shopId" element={<ViewShop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
        </Routes>
      </main>
    </div>
  );
};

export default CustomerDashboard;
