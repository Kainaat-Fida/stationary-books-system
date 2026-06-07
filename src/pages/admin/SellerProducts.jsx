import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../app/firebase";
import { Trash2 } from "lucide-react";

export default function SellerProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), where("sellerId", "==", id));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [id]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", productId));
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Seller Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 text-base md:text-lg">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 relative"
            >
              <div className="w-full h-48 overflow-hidden rounded-xl">
                <img
                  src={p.imageURL || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h2 className="font-semibold mt-3 text-lg md:text-xl text-gray-800 truncate">{p.name}</h2>
              <p className="text-gray-600 text-sm md:text-base mt-1">Rs {p.price}</p>

              {/* Delete button with icon */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition flex items-center justify-center"
                >
                  <Trash2 className="text-red-600" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
