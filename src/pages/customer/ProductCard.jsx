import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart, cartItems = [] }) => {
  const { id, title, name, description, price, shopName, sellerId, imageURL, imageUrl } = product;

  // Check current quantity in cart
  const cartItem = cartItems.find((i) => i.product.id === id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div
      className="
        bg-white rounded-2xl shadow-md overflow-hidden
        hover:shadow-xl transition-all duration-300
        flex flex-col h-full
      "
    >
      {/* Image */}
      <div className="w-full h-48 sm:h-56 md:h-60 lg:h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={imageURL || imageUrl || "https://via.placeholder.com/300"}
          alt={title || name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">

        {/* Title + Desc */}
        <div>
          <h3
            className="
              font-bold text-gray-800

              text-base
              sm:text-lg
              md:text-xl
              lg:text-xl
            "
          >
            {title || name}
          </h3>

          {description && (
            <p
              className="
                text-gray-500 mt-1 line-clamp-2

                text-xs
                sm:text-sm
                md:text-base
              "
            >
              {description}
            </p>
          )}
        </div>

        {/* Bottom */}
        <div className="mt-4 flex flex-col gap-3">

          {/* Price */}
          <div
            className="
              font-bold text-blue-600

              text-lg
              sm:text-xl
              md:text-2xl
            "
          >
            Rs.{price || "0.00"}
          </div>

          {/* In Cart message */}
          {quantity > 0 && (
            <div className="text-green-600 text-xs sm:text-sm">
              In cart: {quantity}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">

            <button
              onClick={() => onAddToCart(product)}
              className="
                w-full sm:w-auto
                bg-blue-600 text-white font-semibold
                py-2 px-4 rounded-xl

                text-sm sm:text-base

                hover:bg-blue-700 active:scale-95 transition
              "
            >
              Add to cart
            </button>

            <Link
              to={`/customer/shop/${sellerId}`}
              className="
                w-full sm:w-auto text-center
                border border-gray-300

                py-2 px-4 rounded-xl

                text-sm sm:text-base
                text-gray-600

                hover:bg-gray-100 transition
              "
            >
              Visit Shop
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
