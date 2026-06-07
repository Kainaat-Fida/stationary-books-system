// src/pages/customer/Cart.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCart,
  removeItemLocal,
  updateQuantityLocal,
  setCartFromLocal,
} from "../../features/customer/customerSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCart(user.uid));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      dispatch(setCartFromLocal({ userId: null, items: guestCart }));
    }
  }, [dispatch, user?.uid]);

  const handleQty = async (productId, newQty) => {
    if (newQty < 1) return;

    dispatch(updateQuantityLocal({ productId, quantity: newQty }));

    const updatedItems = cart.items.map((i) =>
      i.product.id === productId ? { ...i, quantity: newQty } : i
    );

    if (user?.uid) {
      await dispatch(updateCart({ userId: user.uid, items: updatedItems })).unwrap();
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(updatedItems));
      dispatch(setCartFromLocal({ userId: null, items: updatedItems }));
    }
  };

  const handleRemove = async (productId) => {
    dispatch(removeItemLocal(productId));

    const updatedItems = cart.items.filter((i) => i.product.id !== productId);

    if (user?.uid) {
      await dispatch(updateCart({ userId: user.uid, items: updatedItems })).unwrap();
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(updatedItems));
      dispatch(setCartFromLocal({ userId: null, items: updatedItems }));
    }
  };

  const subtotal = (cart.items || []).reduce(
    (acc, it) => acc + Number(it.product.price) * it.quantity,
    0
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h1>

      {!cart?.items?.length ? (
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link
            to="/customer/products"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((it) => (
              <div
                key={it.product.id}
                className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-full sm:w-24 flex-shrink-0">
                  <img
                    src={it.product.imageURL || it.product.imageUrl || "https://via.placeholder.com/150"}
                    alt={it.product.title || it.product.name}
                    className="w-full h-auto max-h-40 sm:max-h-24 object-contain rounded-lg bg-gray-50"
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between w-full gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{it.product.title || it.product.name}</div>
                    <div className="text-sm text-gray-500">Shop: {it.product.shopName || "-"}</div>
                    <div className="text-gray-700 font-semibold mt-2">${it.product.price}</div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQty(it.product.id, it.quantity - 1)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <div className="px-3">{it.quantity}</div>
                      <button
                        onClick={() => handleQty(it.product.id, it.quantity + 1)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(it.product.id)}
                      className="text-red-500 text-sm mt-1 sm:mt-0 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-4">
            <div className="text-lg font-semibold">Order Summary</div>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/customer/checkout")}
              className="w-full py-3 bg-blue-600 text-white rounded-xl mt-4 hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
