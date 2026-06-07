import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../app/firebase";

const OrderHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : data.createdAt,
          updatedAt: data.updatedAt?.seconds
            ? new Date(data.updatedAt.seconds * 1000).toISOString()
            : data.updatedAt,
        };
      });

      fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (!orders.length) {
    return (
      <div className="p-6 sm:p-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your Orders</h1>
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((o) => (
          <div key={o.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-lg sm:text-xl">Order #{o.id}</div>
                <div className="text-sm text-gray-500">
                  Placed: {o.createdAt ? new Date(o.createdAt).toLocaleString() : "Unknown"}
                </div>
                <div className="text-sm text-gray-700">Total: ${o.total}</div>
                <div className="text-sm">
                  Status:{" "}
                  <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800">
                    {o.status}
                  </span>
                </div>
                {o.updatedAt && (
                  <div className="text-xs text-gray-400">
                    Last updated: {new Date(o.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-2 space-y-2">
              {o.items?.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-2"
                >
                  <span className="font-medium text-gray-700">{item.product.name}</span>
                  <span className="text-gray-600 mt-1 sm:mt-0">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
