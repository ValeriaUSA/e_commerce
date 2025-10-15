import { useCart } from "../contexts/CartContext"
import CartBooks from '../assets/icons/CartBooks.svg?react';

//This component manages Offcanvas display and shows total qnty in Cart
const CartWidget = ({ toggleCart }) => {

    // access to the function to cnt total qnty from the Cart content
    const { calcTotalQnty } = useCart();
    const totalQnty = calcTotalQnty();

    // Function to stop event propagation onClick 
    const handleClick = (e) => {
        e.preventDefault(); // stops the default NavLink action if used directly
        e.stopPropagation(); // <-- Important: Stops the click from bubbling up to the NavLink
        toggleCart(); // Call the function to open the offcanvas
    };



    return (
        <button
            className="cart-widget btn btn-outline-light d-flex align-items-center position-relative p-2 rounded-lg"
            onClick={handleClick}
            aria-label={`Open Cart with ${totalQnty} items`}
            style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'white',
            }}
        >
            <CartBooks
                style={{ width: '24px', height: '24px', marginRight: '4px' }}
            />

            Cart ({totalQnty > 0 ? totalQnty : 0})

            {/* Optional: Position a badge for visual emphasis
            {totalQnty > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalQnty}
                    <span className="visually-hidden">items in cart</span>
                </span>
            )} */}
        </button>
    )
}

export default CartWidget;

