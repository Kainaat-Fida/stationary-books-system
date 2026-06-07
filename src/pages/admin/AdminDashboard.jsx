import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebase";
import { Users, Package, ShoppingCart, Store } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    sellers: 0,
    customers: 0,
    products: 0,
    orders: 0,
  });

  const icons = [
    <Store className="w-8 h-8 text-blue-600" />,
    <Users className="w-8 h-8 text-green-600" />,
    <Package className="w-8 h-8 text-purple-600" />,
    <ShoppingCart className="w-8 h-8 text-orange-600" />,
  ];

  useEffect(() => {
    const fetchStats = async () => {
      const sellersSnap = await getDocs(
        query(collection(db, "users"), where("role", "==", "seller"))
      );
      const customersSnap = await getDocs(
        query(collection(db, "users"), where("role", "==", "customer"))
      );
      const productsSnap = await getDocs(collection(db, "products"));
      const ordersSnap = await getDocs(collection(db, "orders"));

      setStats({
        sellers: sellersSnap.size,
        customers: customersSnap.size,
        products: productsSnap.size,
        orders: ordersSnap.size,
      });
    };

    fetchStats();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {["Sellers", "Customers", "Products", "Orders"].map((title, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow flex flex-col gap-3"
          >
            {icons[i]}
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <h2 className="text-3xl font-bold">{Object.values(stats)[i]}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
