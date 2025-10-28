import { useCart } from "../contexts/CartContext";

const CartProduct = ({ item: product }) => {
 
    const { updateQntyInCart, removeProductFromCart } = useCart();

  // Handler for typing in the input field 
  const handleQntyUpdate = (event) => {
    let newQnty = parseInt(event.target.value, 10);
    if (isNaN(newQnty) || newQnty < 0) newQnty = 0; // prevent negative or invalid
    updateQntyInCart(product.productId, newQnty);
  };

  // Increment quantity
  const incrementQnty = () => {
    updateQntyInCart(product.productId, product.quantity + 1);
  };

  // Decrement quantity - remove if reches 0
  const decrementQnty = () => {
    if (product.quantity > 1) {
      updateQntyInCart(product.productId  , product.quantity - 1);
    }else {
           removeProductFromCart(product.productId);
    } 
  };

  // Remove product explicitly witt X button
  const handleRemoveProduct = () => {
    console.log("🐞[CartProduct] Removing product:", product);
   removeProductFromCart(product.productId);
  };

  return (
    <div className="cart-product">
      {/* Book title */}
      <span>{product.title}</span>

      {/* Price */}
      <span>${Number(product.price).toFixed(2)}</span>

      {/* Quantity controls */}
     <div className="quantity-controls flex items-center gap-2 w-1/4 justify-center">
        <button
          onClick={decrementQnty}
          aria-label="Decrease quantity"
          disabled={product.quantity <= 0} // prevent going negative
          className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>

        <input
          type="number"
          min="0"
          value={product.quantity}
          onChange={handleQntyUpdate}
          className="w-12 text-center border rounded"
        />

        <button
          onClick={incrementQnty}
          aria-label="Increase quantity"
          className="px-2 py-1 border rounded"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <span className="w-1/6 text-right">
        ${(Number(product.price) * product.quantity).toFixed(2)}
      </span>

      {/* Remove button */}
      <button
        onClick={handleRemoveProduct}
        aria-label="Remove from your Cart"
        className="text-red-500 text-xl"
      >
        &times;
      </button>
    </div>
  );
};

export default CartProduct;
