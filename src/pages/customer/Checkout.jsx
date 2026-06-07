import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, placeOrder, clearCart } from "../../features/customer/customerSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading, error } = useSelector((state) => state.customer);
  const { user, userData } = useSelector((state) => state.auth);

  const [shipping, setShipping] = useState({ address: "", city: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (userData) {
      setShipping({
        address: userData.address || "",
        city: userData.city || "",
        phone: userData.phone || "",
      });
    }
  }, [userData]);

  useEffect(() => {
    if (user?.uid) dispatch(fetchCart(user.uid));
  }, [dispatch, user?.uid]);

  const subtotal = (cart.items || []).reduce(
    (acc, it) => acc + Number(it.product.price) * Number(it.quantity),
    0
  );

  const handlePlaceOrder = async () => {
    if (!user?.uid) {
      alert("Please sign in first");
      navigate("/signin");
      return;
    }
    if (!cart.items?.length) {
      alert("Your cart is empty");
      return;
    }

    setPlacingOrder(true);
    try {
      await dispatch(
        placeOrder({
          userId: user.uid,
          items: cart.items,
          total: subtotal,
          shipping,
          paymentMethod,
        })
      ).unwrap();

      await dispatch(clearCart(user.uid));
      alert("✅ Order placed successfully!");
      navigate("/customer/orders");
    } catch (err) {
      console.error(err);
      alert("❌ Order failed");
    }
    setPlacingOrder(false);
  };

  if (!user)
    return <div className="p-6 text-lg">Please login first</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* SHIPPING FORM */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping</h2>

          <input
            value={shipping.address}
            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
            placeholder="Address"
            className="w-full p-3 border rounded-xl mb-3"
          />
          <input
            value={shipping.city}
            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
            placeholder="City"
            className="w-full p-3 border rounded-xl mb-3"
          />
          <input
            value={shipping.phone}
            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
            placeholder="Phone"
            className="w-full p-3 border rounded-xl mb-3"
          />

          <h2 className="text-xl font-semibold mt-6 mb-3">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Card</option>
          </select>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder || loading}
            className={`mt-6 w-full py-3 text-white rounded-xl ${
              placingOrder || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>

          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>

        {/* CART SUMMARY */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3">
            {cart.items?.map((it) => (
              <div
                key={it.product.id}
                className="flex flex-col sm:flex-row justify-between border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{it.product.title}</p>
                  <p className="text-sm text-gray-600 mt-1 sm:mt-0">Qty: {it.quantity}</p>
                </div>
                <p className="font-bold mt-1 sm:mt-0">
                  ${Number(it.product.price * it.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 mt-4 border-t font-bold text-lg">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
