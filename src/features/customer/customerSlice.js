import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../app/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  addDoc
} from "firebase/firestore";
import { logout } from "../auth/authSlice";

// ---------- INITIAL STATE ----------
const initialState = {
  products: [],
  shops: [],
  shopDetails: null,
  shopProducts: [],
  cart: { userId: null, items: [], updatedAt: null },
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// ---------- THUNKS ----------

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "customer/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const productsSnap = await getDocs(collection(db, "products"));
      const products = productsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sellersSnap = await getDocs(
        query(collection(db, "users"), where("role", "==", "seller"))
      );

      const sellerMap = {};
      sellersSnap.docs.forEach((doc) => {
        const data = doc.data();
        sellerMap[doc.id] = data.shopName || "-";
      });

      return products.map((p) => ({
        ...p,
        shopName: p.sellerId ? sellerMap[p.sellerId] || "-" : "-",
        createdAt: p.createdAt?.seconds
          ? new Date(p.createdAt.seconds * 1000).toISOString()
          : p.createdAt,
        updatedAt: p.updatedAt?.seconds
          ? new Date(p.updatedAt.seconds * 1000).toISOString()
          : p.updatedAt,
      }));
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  }
);

// Fetch all shops
export const fetchShops = createAsyncThunk(
  "customer/fetchShops",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "seller"))
      );
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch single shop + its products
export const fetchShopDetails = createAsyncThunk(
  "customer/fetchShopDetails",
  async (sellerId, { rejectWithValue }) => {
    try {
      if (!sellerId) return rejectWithValue("Invalid seller ID");

      const shopSnap = await getDoc(doc(db, "users", sellerId));
      if (!shopSnap.exists() || shopSnap.data().role !== "seller")
        return rejectWithValue("Shop not found");

      const shop = { id: shopSnap.id, ...shopSnap.data() };
      const shopName = shop.shopName || "-";

      const productsSnap = await getDocs(
        query(collection(db, "products"), where("sellerId", "==", sellerId))
      );

      const products = productsSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          shopName,
          createdAt: data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : data.createdAt,
          updatedAt: data.updatedAt?.seconds
            ? new Date(data.updatedAt.seconds * 1000).toISOString()
            : data.updatedAt,
        };
      });

      return { shop, products };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch shop details");
    }
  }
);

// Fetch cart
export const fetchCart = createAsyncThunk(
  "customer/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const cartSnap = await getDoc(doc(db, "carts", userId));
      if (!cartSnap.exists())
        return { userId, items: [], updatedAt: null };

      const data = cartSnap.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate().toISOString()
          : null,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update cart
export const updateCart = createAsyncThunk(
  "customer/updateCart",
  async ({ userId, items }, { rejectWithValue }) => {
    try {
      await setDoc(doc(db, "carts", userId), {
        userId,
        items,
        updatedAt: serverTimestamp(),
      });

      return { userId, items, updatedAt: new Date().toISOString() };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "customer/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      await setDoc(doc(db, "carts", userId), {
        userId,
        items: [],
        updatedAt: serverTimestamp(),
      });

      return { userId, items: [], updatedAt: new Date().toISOString() };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Place order ✅ FIXED
export const placeOrder = createAsyncThunk(
  "customer/placeOrder",
  async ({ userId, items, total, shipping, paymentMethod }, { rejectWithValue }) => {
    try {
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

      return { id: docRef.id, ...orderData };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to place order");
    }
  }
);

// Fetch user orders
export const fetchOrders = createAsyncThunk(
  "customer/fetchOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const ordersSnap = await getDocs(
        query(collection(db, "orders"), where("userId", "==", userId))
      );

      const orders = ordersSnap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : data.createdAt,
          updatedAt: data.updatedAt?.seconds
            ? new Date(data.updatedAt.seconds * 1000).toISOString()
            : data.updatedAt,
        };
      });

      return orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------- SLICE ----------
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addItemLocal: (state, action) => {
      const item = action.payload;
      const idx = state.cart.items.findIndex(
        (i) => i.product.id === item.product.id
      );
      if (idx === -1) state.cart.items.push(item);
      else state.cart.items[idx].quantity += item.quantity;
    },

    removeItemLocal: (state, action) => {
      state.cart.items = state.cart.items.filter(
        (i) => i.product.id !== action.payload
      );
    },

    updateQuantityLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const idx = state.cart.items.findIndex(
        (i) => i.product.id === productId
      );
      if (idx !== -1) state.cart.items[idx].quantity = quantity;
    },

    resetShopDetails: (state) => {
      state.shopDetails = null;
      state.shopProducts = [];
    },

    setCartFromLocal: (state, action) => {
      state.cart = action.payload;
    },

    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // PRODUCTS
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.products = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // SHOPS
      .addCase(fetchShops.fulfilled, (s, a) => {
        s.shops = a.payload;
      })

      // SHOP DETAILS
      .addCase(fetchShopDetails.fulfilled, (s, a) => {
        s.shopDetails = a.payload.shop;
        s.shopProducts = a.payload.products;
      })

      // CART
      .addCase(fetchCart.fulfilled, (s, a) => {
        s.cart = a.payload;
      })
      .addCase(updateCart.fulfilled, (s, a) => {
        s.cart = a.payload;
      })
      .addCase(clearCart.fulfilled, (s, a) => {
        s.cart = a.payload;
      })

      // ORDERS
      .addCase(placeOrder.fulfilled, (s, a) => {
        s.orders.unshift(a.payload);
        s.currentOrder = a.payload;
        s.cart = { userId: null, items: [], updatedAt: null }; // clear local
      })

      .addCase(fetchOrders.fulfilled, (s, a) => {
        s.orders = a.payload;
      })

      // LOGOUT
      .addCase(logout, (s) => {
        s.cart = { userId: null, items: [], updatedAt: null };
        s.currentOrder = null;
        s.orders = [];
      });
  },
});

// ---------- EXPORTS ----------
export const {
  addItemLocal,
  removeItemLocal,
  updateQuantityLocal,
  resetShopDetails,
  setCartFromLocal,
  setCurrentOrder,
} = customerSlice.actions;

export default customerSlice.reducer;
