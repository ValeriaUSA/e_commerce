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
      updateQntyInCart(product.productId, product.quantity - 1);
    } else {
      removeProductFromCart(product.productId);
    }
  };

  // Remove product explicitly witt X button
  const handleRemoveProduct = () => {
    removeProductFromCart(product.productId);
  };

  
  return (
    <div className="cart-product flex flex-col gap-2">

      {/* ROW 1: Title (Full Width) */}
      <div className="cart-product-title font-medium">
        {product.title}
      </div>

      {/* ROW 2: Image + Controls + Subtotal */}
      <div className="flex flex-row items-center gap-3 w-full">
        {/* Image */}
        <img
          src={product.imgurl}
          alt="product"
          className="cart-product-img w-20 h-20 object-contain rounded"
        />

        {/* Middle Column: Controls & Remove */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="quantity-controls flex items-center">
            <button onClick={decrementQnty} className="btn-qnty">-</button>
            <input
              type="number"
              min="0"
              value={product.quantity}
              onChange={handleQntyUpdate}
            />
            <button onClick={incrementQnty} className="btn-qnty">+</button>
          </div>

          <button onClick={handleRemoveProduct} className="text-red-500 text-xs text-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>

        {/* Right Column: Subtotal */}
        <div className="text-right font-semibold text-sm self-end">
          ${(Number(product.price) * product.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};




export default CartProduct;
