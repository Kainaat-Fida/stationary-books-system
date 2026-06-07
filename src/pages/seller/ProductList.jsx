import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../features/seller/sellerSlice";
import EditProduct from "./EditProduct";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react"; // Icons

const ProductList = ({ products }) => {
  const dispatch = useDispatch();
  const [editProduct, setEditProduct] = useState(null);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId))
        .unwrap()
        .then(() => toast.success("Product deleted successfully!"))
        .catch((err) => toast.error(err.message || "Failed to delete product."));
    }
  };

  if (!products?.length)
    return (
      <p className="text-gray-500 text-center mt-16 text-base sm:text-lg md:text-xl font-medium">
        No products added yet.
      </p>
    );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left col-span-full">
          Products
        </h2>

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-5 md:p-6 relative flex flex-col"
          >
            {/* Edit/Delete Icons */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button
                onClick={() => setEditProduct(product)}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition"
                title="Edit Product"
              >
                <Edit className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition"
                title="Delete Product"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>

            {/* Image Container */}
            <div className="w-full bg-gray-100 rounded-2xl p-3 flex items-center justify-center h-48 sm:h-52 md:h-60 lg:h-64">
              <img
                src={product.imageURL || "https://via.placeholder.com/300"}
                alt={product.name}
                className="max-h-full w-auto object-contain"
              />
            </div>

            {/* Content */}
            <div className="mt-4 space-y-2 flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                {product.name}
              </h3>

              <p className="text-sm sm:text-base md:text-base text-gray-600 line-clamp-3">
                {product.description || "No description available"}
              </p>

              <p className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mt-2">
                Price: Rs. {product.price}
              </p>

              <p className="text-sm sm:text-base md:text-base text-gray-500">
                Category: {product.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      {editProduct && (
        <EditProduct product={editProduct} closeModal={() => setEditProduct(null)} />
      )}
    </>
  );
};

export default ProductList;
