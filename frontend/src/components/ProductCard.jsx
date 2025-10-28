import AddToCartButton from "./AddtoCartBtn";
import { BsCartCheckFill } from "react-icons/bs";
import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product }) {
  const price = product.price ? parseFloat(product.price) : 0;
  const isBestseller = Boolean(product.isbestseller);

  // Get cart items from context
  const { cartItems } = useCart();

  // Check if the product is in the cart
  const isInCart = cartItems.some(item => item.productId === product.productId);

    
  // console.log("🐞 Debugging:", product.title, "isInCart:", isInCart);



console.log("Product:", product.title, "isInCart:", isInCart);

  return (
    <div className="product-card border rounded-lg p-4 shadow-md hover:shadow-lg transition relative">
      {/* Cart icon if in cart */}
      {isInCart && (
        <div className="absolute top-2 right-2 text-2xl text-green-600">
          <BsCartCheckFill title="In Cart" />
        </div>
      )}

      <img
        src={product.imgurl}
        alt={product.title}
        className="w-full h-48 object-cover mb-4 rounded"
      />

      <h2 className="text-lg font-bold mb-2">{product.productId}</h2>
      <h2 className="text-lg font-bold mb-2">{product.title}</h2>
      <p className="text-sm text-gray-600 mb-1">Author: {product.author}</p>
      <p className="text-sm text-gray-600 mb-1">Category: {product.category_name}</p>

      <p className="text-sm text-yellow-500 mb-1">
        {product.stars} ({product.reviews} reviews)
      </p>

      <p className="text-lg font-semibold mb-2">EUR {price.toFixed(2)}</p>

      {isBestseller && (
        <span className="text-red-500 font-bold">Bestseller</span>
      )}

      {product.publisheddate && (
        <p className="text-xs text-gray-400 mt-2">
          Published: {new Date(product.publisheddate).toLocaleDateString()}
        </p>
      )}

      <AddToCartButton product={product} />
    </div>
  );
}

