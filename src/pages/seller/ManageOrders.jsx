import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../app/firebase";

const STATUS_OPTIONS = ["pending", "Packed", "shipped", "on the way", "delivered"];

const ManageOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const ordersQuery = query(
      collection(db, "orders"),
      where("sellerIds", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus, updatedAt: serverTimestamp() });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
            : o
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("You don't have permission to update this order.");
    }
  };

  if (loading)
    return <p className="p-6 text-gray-600 text-center text-lg">Loading orders...</p>;
  if (error)
    return <p className="p-6 text-red-600 text-center text-lg">{error}</p>;
  if (!orders.length)
    return <p className="p-6 text-gray-600 text-center text-lg">No orders found.</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left">
        Manage Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
        >
          {/* Order Header */}
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-2 md:gap-4 text-sm sm:text-base md:text-lg">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{order.status}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 mb-4 text-sm sm:text-base">
            <p>
              <strong>Total:</strong> Rs {order.total}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Shipping:</strong> {order.shipping?.address}, {order.shipping?.city}
            </p>
            <p>
              <strong>Phone:</strong> {order.shipping?.phone}
            </p>
          </div>

          {/* Items */}
          <h4 className="font-semibold text-lg sm:text-xl mb-3">Items:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-3 items-center sm:items-start p-3 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.product.imageURL}
                  alt={item.product.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="text-center sm:text-left space-y-1">
                  <p className="font-medium text-gray-800 text-sm sm:text-base md:text-lg">
                    {item.product.name}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Category: {item.product.category}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Price: Rs {item.product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="font-medium text-gray-700 text-sm sm:text-base">
              Update Status:
            </label>
            <select
              className="px-3 py-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
              value={order.status}
              onChange={(e) => handleChangeStatus(order.id, e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageOrders;
