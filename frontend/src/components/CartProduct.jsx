import { useCart } from "../contexts/CartContext"

// Renders a single product item within the cart list.
// Provides controls for qnty adjustment and removal.

const CartProduct = ({ item:product, removeProduct, updateQnty }) => {


    //Handler for qnty update via the input field:
    const handleQntyUpdate = (event) => {

        //Get the input and convert to int and after update the qnty with context function
        const newQnty = parseInt(event.target.value, 10);
        updateQnty(product.id, newQnty);
    };

    //Handler to remove a product from cart:
    const handleRemoveProduct = (event) => {
        removeProduct(product.id)
    };

    return (

        <div>

            {/* Book title */}
            <span>{product.title}</span>

            {/* Price */}
            <span>{product.price}</span>

            {/* Qnty control input */}
            <input
                type="number"
                min="0" //no negative amnt
                value={product.quantity}
                onChange={handleQntyUpdate}
            />

            {/* Subtotal calc */}
            <span>
                ${(product.price * product.quantity).toFixed(2)}
            </span>

            {/* Remove button */}

            <button
                onClick={handleRemoveProduct}
                aria-label="Remove from your Cart"
            >
                &times;
            </button>

        </div>

    )

}

export default CartProduct