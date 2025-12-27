import { useCart } from "../contexts/CartContext";

const CartProduct = ({ item: product }) => {
  const { updateQntyInCart, removeProductFromCart } = useCart();
  const maxStock = product.stock ?? null;

  // Handle input changes safely
  const handleInputChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    if (maxStock && value > maxStock) value = maxStock;
    updateQntyInCart(product.productId, value);
  };

  return (
    <div className="cart-product">
      {/* ROW 1 — TITLE */}
      <div className="cart-row-title">{product.title}</div>

      {/* ROW 2 — IMAGE + QNTY + BIN */}
      <div className="cart-row-main">
        <img
          src={product.imgurl}
          alt="book"
          className="cart-product-img"
        />

        <div className="quantity-controls-wrapper">
          <div className="quantity-controls">
            <button
              onClick={() =>
                updateQntyInCart(
                  product.productId,
                  Math.max(1, product.quantity - 1)
                )
              }
            >
              -
            </button>

            <input
              type="number"
              min="1"
              max={maxStock ?? undefined}
              value={product.quantity}
              onChange={handleInputChange}
            />

            <button
              onClick={() =>
                updateQntyInCart(
                  product.productId,
                  maxStock
                    ? Math.min(product.quantity + 1, maxStock)
                    : product.quantity + 1
                )
              }
              disabled={maxStock && product.quantity >= maxStock}
            >
              +
            </button>

            {/* Single bin button */}
            <button
              className="cart-remove-btn"
              onClick={() => removeProductFromCart(product.productId)}
              aria-label="Remove product"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      {/* ROW 3 — PRICE + STOCK */}
      <div className="cart-row-meta">
        <span className="unit-price">EUR{Number(product.price).toFixed(2)}</span>
        {maxStock !== null && (
          <span className="stock-info">In stock: {maxStock}</span>
        )}
      </div>

      {/* ROW 4 — SUBTOTAL */}
      <div className="cart-row-subtotal">
        Subtotal: ${(product.price * product.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartProduct;
