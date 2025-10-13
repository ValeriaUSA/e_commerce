import { useCart } from "../contexts/CartContext"
import CartBooks from '../assets/icons/CartBooks.svg?react'; 

const CartWidget = () => {

    // access to the function to cnt total qnty from the Cart content
    const {calcTotalQnty} = useCart();

    const totalQnty = calcTotalQnty();

    return (
        <div 
            className="cart-widget" 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}
        >
            
            <CartBooks
       
            />

            Cart ({totalQnty > 0 ? totalQnty : 0}) 
        </div>
    )
}

export default CartWidget;