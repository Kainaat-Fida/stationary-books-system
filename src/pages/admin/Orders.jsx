import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase";
import { Trash2, Edit2 } from "lucide-react";

const STATUS_OPTIONS = ["pending", "acked", "shipped", "on the way", "delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFields, setEditFields] = useState({
    total: "",
    status: "",
    paymentMethod: "",
    customerName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPhone: "",
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), async (snapshot) => {
      const fetchedOrders = await Promise.all(
        snapshot.docs.map(async (d) => {
          const data = { id: d.id, ...d.data() };
          if (data.userId) {
            const customerDoc = await getDoc(doc(db, "users", data.userId));
            data.customerName = customerDoc.exists() ? customerDoc.data().name : "Unknown";
          }
          return data;
        })
      );
      setOrders(fetchedOrders);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", id));
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setEditFields({
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      customerName: order.customerName || "",
      shippingAddress: order.shipping?.address || "",
      shippingCity: order.shipping?.city || "",
      shippingPhone: order.shipping?.phone || "",
    });
  };

  const handleUpdate = async () => {
    const orderRef = doc(db, "orders", editingOrder.id);
    await updateDoc(orderRef, {
      total: editFields.total,
      status: editFields.status,
      paymentMethod: editFields.paymentMethod,
      shipping: {
        address: editFields.shippingAddress,
        city: editFields.shippingCity,
        phone: editFields.shippingPhone,
      },
      updatedAt: serverTimestamp(),
    });
    setEditingOrder(null);
  };

  if (loading) return <p className="p-6 text-center text-base md:text-lg">Loading orders...</p>;
  if (!orders.length) return <p className="p-6 text-center text-base md:text-lg">No orders found.</p>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white p-4 md:p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 relative"
          >
            {/* Top container with icons */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm md:text-base font-medium">
                  <b>Order ID:</b><br /> {o.id}
                </p>
                <p className="text-sm md:text-base font-medium capitalize mt-1">
                  <b>Status:</b> {o.status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(o)}
                  className="bg-white p-2 rounded-full shadow hover:shadow-lg transition flex items-center justify-center"
                >
                  <Edit2 size={18} className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(o.id)}
                  className="bg-white p-2 rounded-full shadow hover:shadow-lg transition flex items-center justify-center"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>

            <p className="text-sm md:text-base"><b>Total:</b> Rs {o.total}</p>
            <p className="text-sm md:text-base"><b>Payment:</b> {o.paymentMethod}</p>
            <p className="text-sm md:text-base"><b>Customer:</b> {o.customerName}</p>
            <p className="text-sm md:text-base">
              <b>Shipping:</b> {o.shipping?.address}, {o.shipping?.city}
            </p>
            <p className="text-sm md:text-base"><b>Phone:</b> {o.shipping?.phone}</p>
          </div>
        ))}
      </div>

      {/* Floating Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-12 md:mt-20 p-6 max-h-[90vh] overflow-auto relative">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                Edit Order
              </h2>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Info */}
              {[
                { label: "Total", value: editFields.total, type: "number", key: "total" },
                { label: "Payment Method", value: editFields.paymentMethod, type: "text", key: "paymentMethod" },
                { label: "Customer Name", value: editFields.customerName, type: "text", key: "customerName" },
              ].map((field) => (
                <div key={field.key} className="flex flex-col">
                  <label className="flex items-center gap-2 font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
                    value={field.value}
                    onChange={(e) => setEditFields({ ...editFields, [field.key]: e.target.value })}
                  />
                </div>
              ))}

              {/* Shipping Info Card */}
              <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="font-semibold text-gray-700 mb-2">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Address"
                    value={editFields.shippingAddress}
                    onChange={(e) => setEditFields({ ...editFields, shippingAddress: e.target.value })}
                    className="col-span-1 md:col-span-3 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={editFields.shippingCity}
                    onChange={(e) => setEditFields({ ...editFields, shippingCity: e.target.value })}
                    className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={editFields.shippingPhone}
                    onChange={(e) => setEditFields({ ...editFields, shippingPhone: e.target.value })}
                    className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="flex flex-col">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
                  value={editFields.status}
                  onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex flex-col md:flex-row justify-end gap-3 sticky bottom-0 bg-white pt-4 border-t">
              <button
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-sm md:text-base flex items-center justify-center gap-1"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base flex items-center justify-center gap-1"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
