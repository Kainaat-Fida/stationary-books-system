import { doc, updateDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase";
import { serverTimestamp } from "firebase/firestore";


// -------------------- Fetch orders for seller --------------------
export const fetchOrdersBySellerAPI = async (sellerId) => {
  const ordersRef = collection(db, "orders");

  // Only fetch orders where sellerId is in sellerIds (matches Firestore rules)
  const q = query(ordersRef, where("sellerIds", "array-contains", sellerId));
  const snapshot = await getDocs(q);

  const orders = snapshot.docs.map(doc => {
    const data = doc.data();

    // Convert Firestore timestamps to ISO strings
    if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate().toISOString();
    if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate().toISOString();

    return { id: doc.id, ...data };
  });

  return orders;
};

// -------------------- Update order status --------------------
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export const updateOrderStatusAPI = async (orderId, status) => {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  return { id: orderId, status };
};

