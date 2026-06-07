import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../features/seller/sellerSlice";
import { toast } from "react-toastify";

const EditProduct = ({ product, closeModal }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    imageURL: product.imageURL,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct({ productId: product.id, updatedData: formData }));
      toast.success("Product updated!");
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to update product.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mt-4 mb-6 text-gray-800 text-center">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 px-4 sm:px-6 pb-6">
          {/* Product Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Product Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              required
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Price (Rs.)</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Image URL</label>
            <input
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              Update
            </button>

            <button
              onClick={closeModal}
              type="button"
              className="w-full sm:w-auto px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
