import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import sellerReducer from "../features/seller/sellerSlice";
import customerReducer from "../features/customer/customerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    seller: sellerReducer,
    customer: customerReducer,
  },
});
