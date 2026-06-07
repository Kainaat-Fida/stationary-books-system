import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../app/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

/* =====================================================
   PROFILE
===================================================== */

export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (!docSnap.exists()) return {};

      const data = docSnap.data();
      const createdAt = data.createdAt?.seconds
        ? new Date(data.createdAt.seconds * 1000).toISOString()
        : data.createdAt || null;

      return { id: docSnap.id, ...data, createdAt };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch seller profile");
    }
  }
);

export const updateSellerProfile = createAsyncThunk(
  "seller/updateProfile",
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { ...profileData, updatedAt: serverTimestamp() });
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update seller profile");
    }
  }
);

/* =====================================================
   PRODUCTS
===================================================== */

export const addProduct = createAsyncThunk(
  "seller/addProduct",
  async ({ userId, product }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        sellerId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { id: docRef.id, ...product, sellerId: userId };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add product");
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  "seller/fetchProducts",
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "products"), where("sellerId", "==", userId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const createdAt = data.createdAt?.seconds
          ? new Date(data.createdAt.seconds * 1000).toISOString()
          : data.createdAt || null;
        const updatedAt = data.updatedAt?.seconds
          ? new Date(data.updatedAt.seconds * 1000).toISOString()
          : data.updatedAt || null;
        return { id: docSnap.id, ...data, createdAt, updatedAt };
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "seller/updateProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "products", productId), { ...updatedData, updatedAt: serverTimestamp() });
      return { id: productId, ...updatedData };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "seller/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

/* =====================================================
   ORDERS
===================================================== */

export const fetchSellerOrders = createAsyncThunk(
  "seller/fetchOrders",
  async (sellerId, { rejectWithValue }) => {
    try {
      if (!sellerId) return rejectWithValue("Invalid seller id");

      const q = query(collection(db, "orders"), where("sellerIds", "array-contains", sellerId));
      const snapshot = await getDocs(q);

      const orders = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const sellerItems = (data.items || []).filter(
            (item) => item.product?.sellerId === sellerId
          );
          if (!sellerItems.length) return null;

          const createdAt = data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : data.createdAt || null;

          const updatedAt = data.updatedAt?.seconds
            ? new Date(data.updatedAt.seconds * 1000).toISOString()
            : data.updatedAt || null;

          return { id: docSnap.id, ...data, items: sellerItems, createdAt, updatedAt };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return orders;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "seller/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status, updatedAt: serverTimestamp() });
      return { id: orderId, status };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update order status");
    }
  }
);

/* =====================================================
   SELLER SLICE
===================================================== */

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    profile: {},
    products: [],
    orders: [],
    loadingProfile: false,
    loadingProducts: false,
    loadingOrders: false,
    errorProfile: null,
    errorProducts: null,
    errorOrders: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // PROFILE
      .addCase(fetchSellerProfile.pending, (state) => { state.loadingProfile = true; })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loadingProfile = false; state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loadingProfile = false; state.errorProfile = action.payload;
      })
      .addCase(updateSellerProfile.pending, (state) => { state.loadingProfile = true; })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.loadingProfile = false; state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.loadingProfile = false; state.errorProfile = action.payload;
      })

      // PRODUCTS
      .addCase(addProduct.pending, (state) => { state.loadingProducts = true; })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loadingProducts = false; state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loadingProducts = false; state.errorProducts = action.payload;
      })
      .addCase(fetchSellerProducts.pending, (state) => { state.loadingProducts = true; })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loadingProducts = false; state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loadingProducts = false; state.errorProducts = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })

      // ORDERS
      .addCase(fetchSellerOrders.pending, (state) => { state.loadingOrders = true; })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loadingOrders = false; state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loadingOrders = false; state.errorOrders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) state.orders[index].status = action.payload.status;
      });
  },
});

export default sellerSlice.reducer;
