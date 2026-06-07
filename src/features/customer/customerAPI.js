import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../../app/firebase";

// PRODUCTS
export const fetchAllProductsAPI = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const fetchProductsBySellerAPI = async (sellerId) => {
  const q = query(collection(db, "products"), where("sellerId", "==", sellerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// SHOPS
export const fetchAllShopsAPI = async () => {
  const q = query(collection(db, "users"), where("role", "==", "seller"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const fetchShopByIdAPI = async (shopId) => {
  const snap = await getDoc(doc(db, "users", shopId));
  if (!snap.exists()) throw new Error("Shop not found");
  return { id: snap.id, ...snap.data() };
};

// CART
export const fetchCartAPI = async (userId) => {
  const snap = await getDoc(doc(db, "carts", userId));
  if (!snap.exists()) return { userId, items: [] };
  return { id: snap.id, ...snap.data() };
};

export const updateCartAPI = async (userId, items) => {
  await setDoc(doc(db, "carts", userId), {
    userId,
    items,
    updatedAt: serverTimestamp(),
  });

  const snap = await getDoc(doc(db, "carts", userId));
  return { id: snap.id, ...snap.data() };
};

export const clearCartAPI = async (userId) => {
  await setDoc(doc(db, "carts", userId), {
    userId,
    items: [],
    updatedAt: serverTimestamp(),
  });

  const snap = await getDoc(doc(db, "carts", userId));
  return { id: snap.id, ...snap.data() };
};

// ORDERS
export const placeOrderAPI = async ({
  userId,
  items,
  total,
  shipping,
  paymentMethod,
}) => {
  const sellerIds = [...new Set(items.map((i) => i.product.sellerId))];

  const orderData = {
    userId,
    items,
    sellerIds,
    total,
    shipping,
    paymentMethod,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), orderData);
  const created = await getDoc(doc(db, "orders", docRef.id));
  return { id: created.id, ...created.data() };
};

export const fetchOrdersByUserAPI = async (userId) => {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const fetchOrderByIdAPI = async (orderId) => {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) throw new Error("Order not found");
  return { id: snap.id, ...snap.data() };
};
