// Renders the list of books ,totals. This component is renderd inside "container" - Offcanvas 

import { useCart } from "../contexts/CartContext";
import CartProduct from '../components/CartProduct'

const CartData = () => {

    const {
        cartItems,
        clearCart,
        calcTotalPrice,
        calcTotalQnty
    } = useCart();


const totalQnty= calcTotalQnty();
const totalPrice = calcTotalPrice();

// Case: Cart is EMPTY
if(cartItems.length ===0) {
    return (
        <div>
            <p> Your cart is empty </p>
        </div>
    )}

// Case: Cart has books in it

return(   <div className="cart-content-full p-2">

                       {/* List of Cart Books */}
            <div className="cart-items-list mb-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {cartItems.map(item => (
                    //  CartItem component handles quantity updates and removal
                    <CartProduct key={item.productId} item={item} />
                ))}
            </div>

            {/* Cart Summary and Actions */}
            <div className="cart-summary border-top pt-3">
                
                {/* Total Price */}
                <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                    <span>Total ({totalQnty} items):</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button 
                    className="btn btn-primary w-100 mb-2"
                    onClick={() => alert('Redirect to Checkout...')}
                >
                    Proceed to Checkout
                </button>
                
                {/* Clear Cart Button */}
                <button
                    className="btn btn-outline-danger w-100 btn-sm"
                    onClick={clearCart}
                >
                    Clear Cart
                </button>
            </div>
        </div>
    );
};

export default CartData;