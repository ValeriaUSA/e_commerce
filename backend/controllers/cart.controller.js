import cartRepository from "../repositories/cart.repository.js";

// THIS VERSION RELIES ON THE CLIENT SENDING THE userId IN THE BODY, 
// WHICH IS INSECURE AND SHOULD BE REPLACED WITH A JWT/SESSION CHECK LATER.
export const addToCart = async (req, res) => {

    const { userId, productId, qnty: quantity } = req.body;
    // SECURITY NOTE: userId should not be retrieved from body 

    if (!userId || !productId || !quantity) {

        return res.status(400).json({ message: "Invalid input. Requires a valid userId, productId, and a positive quantity (qnty)." });
    }

    try {
        const updatedCart = await cartRepository.addProductToCart(userId, productId, quantity);
        return res.status(200).json({
            message: `Book ${productId} was added/updated to the cart `,
            cart: updatedCart,
        })
    } catch (error) {
        console.error("🛒: Error adding a product to cart");
        return res.status(500).json({
            message: "Internal server error while doing cart update"
        })
    }
};


//REMOVE a BOOK from a CART
export const removeFromCart = async (req, res) => {

    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({
            message: "Invalid request body: valid product and use ids are required"
        })
    }

    try {
        const updatedCart = await cartRepository.removeProductFromCart(userId, productId);
        return res.status(200).json({
            message: `Book ${productId} removed from cart`,
            cart: updatedCart
        })

    } catch (error) {
        console.error("Error removing book from cert : ", error);
        return res.status(500).json({
            message: "Internal server error while removing a book from cart",
        })
    }
}


//UPDATE BOOK quantity in CART */- 
export const updateCartQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
        return res.status(400).json({ message: "Invalid regest body" })
    }

    try {
        const updateCart = await cartRepository.updateProductQuantity(userId, productId, quantity);
        return res.status(200).json({
            message: `Cart update for product ${productId}`,
            cart: updateCart
        });
    } catch (error) {
        console.error("Error updating cart quantity", error)
        return res.status(500).json({ message: error.message });
    }
}


// GET CART for user
export const getCartByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "Missing userId parameter" });
    }

    try {
        const cart = await cartRepository.CartContentByUserId(userId);

        if (!cart) {
            return res.status(200).json({ cart: { cartId: null, books: [] } });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error(`[CartController] Error fetching cart for user ${userId}:`, error);
        return res.status(500).json({ message: "Internal server error while fetching cart" });
    }
};



// CLEAR UP ACTIVE CART

export const clearCart = async (req, res) => {
    const { userId } = req.body

    try {
        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "Missing userId- cart clearing is not possible"
            })
        }

        const result = await cartRepository.clearUserCart(userId)

        if (result === null) {
            return res.status(200).json({
                success: true,
                message: `No active cart found for user ${userId}`
            })
        }
        if (result === true) {
            return res.status(200).json({
                success: true,
                message: `User ${userId} cart is cleared successfully`
            })
        }

        // Fallback (unexpected)
        return res.status(500).json({
            success: false,
            message: "Unexpected response while clearing the cart."
        })

    } catch (error) {
         console.error("[Controller] Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while clearing cart.",
      error: error.message,
    });

    }
}

export default {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartByUserId,
    clearCart
}