// src/pages/customer/ViewProducts.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import {
  fetchProducts,
  fetchShopDetails,
  fetchCart,
  updateCart,
  addItemLocal,
  setCartFromLocal,
  resetShopDetails,
} from "../../features/customer/customerSlice";

const useQuery = () => new URLSearchParams(useLocation().search);

const ViewProducts = () => {
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const query = useQuery();
  const searchParam = query.get("search") || "";

  const { products, shopDetails, shopProducts, cart, loading, error } = useSelector(
    (state) => state.customer
  );
  const { user } = useSelector((state) => state.auth);

  const [filtered, setFiltered] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState(searchParam);

  // Fetch products/shop + cart
  useEffect(() => {
    if (sellerId) dispatch(fetchShopDetails(sellerId));
    else dispatch(fetchProducts());

    if (user?.uid) dispatch(fetchCart(user.uid));
    else {
      const local = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      dispatch(setCartFromLocal({ userId: null, items: local }));
    }

    return () => sellerId && dispatch(resetShopDetails());
  }, [dispatch, sellerId, user?.uid]);

  // Sync search param from URL
  useEffect(() => setSearch(searchParam), [searchParam]);

  // Filter & sort products
  useEffect(() => {
    const sourceProducts = sellerId ? shopProducts : products;
    if (!sourceProducts?.length) return setFiltered([]);

    let res = [...sourceProducts];

    if (search) {
      const q = search.toLowerCase();
      res = res.filter(
        (p) =>
          (p.title || p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.shopName || "-").toLowerCase().includes(q)
      );
    }

    if (sortBy) {
      res.sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return Number(a.price || 0) - Number(b.price || 0);
          case "price-desc":
            return Number(b.price || 0) - Number(a.price || 0);
          case "latest":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case "oldest":
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          default:
            return 0;
        }
      });
    }

    setFiltered(res);
  }, [products, shopProducts, search, sortBy, sellerId]);

  // Unified Add-to-Cart
  const handleAddToCart = (product) => {
    dispatch(addItemLocal({ product, quantity: 1 }));

    const updateItems = (items) => {
      const idx = items.findIndex((i) => i.product.id === product.id);
      return idx === -1
        ? [...items, { product, quantity: 1 }]
        : items.map((i, iidx) => (iidx === idx ? { ...i, quantity: i.quantity + 1 } : i));
    };

    if (user?.uid) {
      const updatedItems = updateItems(cart?.items || []);
      dispatch(updateCart({ userId: user.uid, items: updatedItems }));
    } else {
      const local = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const updatedLocal = updateItems(local);
      localStorage.setItem("guest_cart", JSON.stringify(updatedLocal));
      dispatch(setCartFromLocal({ userId: null, items: updatedLocal }));
    }
  };

  return (
    <div className="p-6 sm:p-4">
      {/* Shop info */}
      {sellerId && shopDetails && (
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{shopDetails.shopName}</h1>
          <p className="text-gray-600">{shopDetails.description || ""}</p>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {sellerId ? "Shop Products" : "All Products"}
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-xl w-full sm:w-64"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-xl w-full sm:w-40"
          >
            <option value="">Sort</option>
            <option value="price-asc">Price low → high</option>
            <option value="price-desc">Price high → low</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading && filtered.length === 0 ? (
        <p className="text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>

  );
};

export default ViewProducts;
