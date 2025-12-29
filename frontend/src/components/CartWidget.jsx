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
           
            className="cart-widget btn btn-outline-light d-flex align-items-center position-relative"
            onClick={handleClick}
            aria-label={`Open Cart with ${totalQnty} items`}
        
        >
            <CartBooks
                style={{ width: '24px', height: '24px', marginRight: '4px' }}
            />

            Cart ({totalQnty > 0 ? totalQnty : 0})

            
        </button>
    )
}

export default CartWidget;

