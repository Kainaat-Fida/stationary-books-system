import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../features/seller/sellerSlice";
import { toast } from "react-toastify";

const AddProduct = ({ userId }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageURL: "",
  });

  const handleChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addProduct({ userId, product }));
      toast.success("Product added successfully!");
      setProduct({ name: "", description: "", price: "", category: "", imageURL: "" });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl max-w-3xl mx-auto my-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
          required
        />

        <input
          type="text"
          name="imageURL"
          placeholder="Image URL"
          value={product.imageURL}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
        />

        <button
          type="submit"
          className="w-full py-3 mt-4 rounded-xl text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-all"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
