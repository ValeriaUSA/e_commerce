import { useCart } from "../contexts/CartContext";

// const CartProduct = ({ item: product }) => {
//   const { updateQntyInCart, removeProductFromCart } = useCart();
//   const maxStock = product.stock ?? null;

//   // Handle input changes safely
//   const handleInputChange = (e) => {
//     let value = Number(e.target.value);
//     if (isNaN(value) || value < 1) value = 1;
//     if (maxStock && value > maxStock) value = maxStock;
//     updateQntyInCart(product.productId, value);
//   };

//   return (
//     <div className="cart-product">
//       {/* ROW 1 — TITLE */}
//       <div className="cart-row-title">{product.title}</div>

//       {/* ROW 2 — IMAGE + QNTY + BIN */}
//       <div className="cart-row-main">
//         <img
//           src={product.imgurl}
//           alt="book"
//           className="cart-product-img"
//         />

//         <div className="quantity-controls-wrapper">
//           <div className="quantity-controls">
//             <button
//               onClick={() =>
//                 updateQntyInCart(
//                   product.productId,
//                   Math.max(1, product.quantity - 1)
//                 )
//               }
//             >
//               -
//             </button>

//             <input
//               type="number"
//               min="1"
//               max={maxStock ?? undefined}
//               value={product.quantity}
//               onChange={handleInputChange}
//             />

//             <button
//               onClick={() =>
//                 updateQntyInCart(
//                   product.productId,
//                   maxStock
//                     ? Math.min(product.quantity + 1, maxStock)
//                     : product.quantity + 1
//                 )
//               }
//               disabled={maxStock && product.quantity >= maxStock}
//             >
//               +
//             </button>

//             {/* Single bin button */}
//             <button
//               className="cart-remove-btn"
//               onClick={() => removeProductFromCart(product.productId)}
//               aria-label="Remove product"
//             >
//               🗑
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ROW 3 — PRICE + STOCK */}
//       <div className="cart-row-meta">
//         <span className="unit-price">EUR{Number(product.price).toFixed(2)}</span>
//         <span className="stock-info">Available stock: {product.stock}</span>
//       </div>

//       {/* ROW 4 — SUBTOTAL */}
//       <div className="cart-row-subtotal">
//         Subtotal: ${(product.price * product.quantity).toFixed(2)}
//       </div>
//     </div>
//   );
// };

// export default CartProduct;


const CartProduct = ({ item: product }) => {
  const { updateQntyInCart, removeProductFromCart } = useCart();

  const maxStock = product.stock ?? 0;

  // ✅ FIX: Out-of-stock guard
  const isOutOfStock = maxStock === 0;

  // Handle manual input safely
  const handleInputChange = (e) => {
    let value = Number(e.target.value);

    if (isNaN(value) || value < 1) value = 1;

    // ✅ FIX: clamp to stock
    if (value > maxStock) value = maxStock;

    updateQntyInCart(product.productId, value);
  };

  return (
    <div className={`cart-product ${isOutOfStock ? "out-of-stock-item" : ""}`}>
      
      {/* ROW 1 — TITLE */}
      <div className="cart-row-title">
        {product.title}

        {/* ✅ FIX: Out-of-stock label */}
        {isOutOfStock && (
          <span className="out-of-stock">Out of stock</span>
        )}
      </div>

      {/* ROW 2 — IMAGE + QNTY + BIN */}
      <div className="cart-row-main">
        <img
          src={product.imgurl}
          alt={product.title}
          className="cart-product-img"
        />

        <div className="quantity-controls-wrapper">
          <div className="quantity-controls">

            {/* ➖ MINUS */}
            <button
              onClick={() =>
                updateQntyInCart(
                  product.productId,
                  Math.max(1, product.quantity - 1)
                )
              }
              disabled={isOutOfStock} // ✅ FIX
            >
              −
            </button>

            {/* 🔢 INPUT */}
            <input
              type="number"
              min="1"
              max={maxStock}
              value={product.quantity}
              onChange={handleInputChange}
              disabled={isOutOfStock} // ✅ FIX
            />

            {/* ➕ PLUS */}
            <button
              onClick={() =>
                updateQntyInCart(
                  product.productId,
                  Math.min(product.quantity + 1, maxStock)
                )
              }
              disabled={isOutOfStock || product.quantity >= maxStock} // ✅ FIX
            >
              +
            </button>

            {/* 🗑 REMOVE */}
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
        <span className="unit-price">
          €{Number(product.price).toFixed(2)}
        </span>

        {/* ✅ FIX: Stock text */}
        <span className={`stock-info ${isOutOfStock ? "danger" : ""}`}>
          Available stock: {maxStock}
        </span>
      </div>

      {/* ROW 4 — SUBTOTAL */}
      <div className="cart-row-subtotal">
        Subtotal: €{(product.price * product.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartProduct;