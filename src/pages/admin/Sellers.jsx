import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../app/firebase";
import { useNavigate } from "react-router-dom";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // track which menu is open
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "seller"));
    const unsub = onSnapshot(q, (snap) => {
      setSellers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleDelete = async(id) => {
    if(window.confirm("Delete this seller?")){
      await deleteDoc(doc(db,"users",id));
    }
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Sellers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sellers.map(seller => (
          <div key={seller.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 relative">
            
            {/* Seller image */}
            <div className="w-full h-48 md:h-40 lg:h-48 overflow-hidden rounded-xl">
              <img
                src={seller.photoURL || "https://via.placeholder.com/300"}
                alt={seller.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Seller info */}
            <h2 className="font-semibold mt-3 text-lg md:text-xl text-gray-800 truncate">{seller.name}</h2>
            <p className="text-gray-600 text-sm md:text-base truncate">{seller.shopName}</p>
            <p className="text-gray-500 text-sm break-all">{seller.email}</p>

            {/* Three dots button */}
            <div className="absolute top-3 right-3">
              <button 
                onClick={() => setMenuOpen(menuOpen === seller.id ? null : seller.id)}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              >
                ⋮
              </button>

              {/* Dropdown menu */}
              {menuOpen === seller.id && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20 animate-fade-in">
                  <button
                    onClick={() => navigate(`/admin/seller/${seller.id}`)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-t-xl transition"
                  >
                    View Products
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 rounded-b-xl transition"
                  >
                    Delete Shop
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
