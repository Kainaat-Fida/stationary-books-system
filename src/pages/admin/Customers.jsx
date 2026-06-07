import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../app/firebase";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "customer"));
    const unsub = onSnapshot(q, (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Customers</h1>

      {customers.length === 0 ? (
        <p className="text-gray-500 text-center text-base md:text-lg mt-10">
          No customers found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {customers.map(c => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <p className="text-gray-800 font-semibold text-base md:text-lg mb-1">
                Name: <span className="font-normal">{c.name}</span>
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                Email: <span className="font-normal break-all">{c.email}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
