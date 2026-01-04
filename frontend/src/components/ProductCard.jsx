import { useContext } from "react";
import { useCart } from "../contexts/CartContext";
import { GlobalContext } from "../contexts/GlobalContext";
import AddToCartButton from "./AddtoCartBtn";
import CartBooks from "../assets/icons/CartBooks.svg?react";



const ProductCard = ({ product }) => {
  const { cartItems, addProductToCart } = useCart();
  const { user } = useContext(GlobalContext);
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  // Cart info
  const inCartItem = cartItems.find((i) => i.productId === product.productId);
  const inCartQuantity = inCartItem ? inCartItem.quantity : 0;

  // Disable Add button if out of stock or admin

  const isOutOfStock = product.quantity === 0;
  const isDisabled = isOutOfStock || isAdmin;

  const handleAdd = () => {
    if (!isDisabled) addProductToCart({ ...product, id: product.productId }, 1);
  };

  return (
    <div className="card product-card-custom mb-3">
      <div className="product-image-container">
        <img
          src={product.imgurl || "/placeholder-book.png"}
          alt={product.title}
          className="book-cover-img"
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">Author: {product.author}</p>
        <p className="card-text">Price: €{Number(product.price).toFixed(2)}</p>
        <p className="card-text">Available: {product.quantity}</p>

        {inCartQuantity > 0 && !isAdmin && (
          <div className="in-cart mt-2">
            <CartBooks style={{ width: "16px", height: "16px", marginRight: "4px" }} />
            Already {inCartQuantity} in your cart
          </div>
        )}

        <button
          className={`btn btn-add-cart mt-auto ${isDisabled ? "disabled" : ""}`}
          disabled={isDisabled}
          onClick={handleAdd}
        >
          {isAdmin
            ? "Cart is disabled for admin"
            : isOutOfStock
              ? "Out of stock"
              : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;