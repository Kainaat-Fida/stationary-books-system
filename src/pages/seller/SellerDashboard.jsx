import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSellerProfile, fetchSellerProducts } from "../../features/seller/sellerSlice";
import SellerNavbar from "./SellerNavbar";
import SellerProfile from "./SellerProfile";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import ManageOrders from "./ManageOrders";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { profile = {}, products = [] } = useSelector((state) => state.seller);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchSellerProfile(user.uid));
      dispatch(fetchSellerProducts(user.uid));
    }
  }, [dispatch, user?.uid]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "profile" && <SellerProfile profile={profile} userId={user?.uid} />}
        {activeTab === "addProduct" && <AddProduct userId={user?.uid} />}
        {activeTab === "products" && <ProductList products={products} />}
        {activeTab === "manageOrders" && <ManageOrders />}
      </div>
    </div>
  );
};

export default SellerDashboard;
