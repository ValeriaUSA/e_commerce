import React from 'react';
import { useCart } from '../contexts/CartContext'; // Adjust path to your CartContext file

/**
 * Renders a single product item within the cart list.
 * Provides controls for quantity adjustment and removal.
 * * @param {object} props.item - The cart item object (e.g., { id, name, price, quantity })
 */
const CartItem = ({ item }) => {
    // Access the necessary cart action functions from the custom hook
    const { updateQnty, removeProduct } = useCart();

    // Handler for updating quantity via the input field
    const handleQuantityChange = (event) => {
        // Get the new value from the input, convert it to an integer
        const newQnty = parseInt(event.target.value, 10);
        
        // Call the context function to update the quantity
        // Context logic handles removing the item if newQnty <= 0
        updateQnty(item.id, newQnty);
    };

    // Handler for the dedicated remove button
    const handleRemoveClick = () => {
        // Call the context function to remove the product
        removeProduct(item.id);
    };

    return (
        <div className="cart-item-container">
            
            {/* Item Name */}
            <span className="item-name">{item.name}</span>

            {/* Price */}
            <span className="item-price">
                ${item.price ? item.price.toFixed(2) : '0.00'}
            </span>
            
            {/* Quantity Control Input */}
            <input
                className="item-quantity-input"
                type="number"
                min="0" // Quantity should not be negative
                value={item.quantity}
                onChange={handleQuantityChange}
            />

            {/* Subtotal Calculation */}
            <span className="item-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
            </span>

            {/* Remove Button */}
            <button 
                className="item-remove-btn"
                onClick={handleRemoveClick}
                aria-label={`Remove ${item.name}`}
            >
                &times;
            </button>
        </div>
    );
};

export default CartItem;


