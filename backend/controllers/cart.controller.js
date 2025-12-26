import cartRepository from "../repositories/cart.repository.js";

//ADD a BOOK to a CART
export const addToCart = async (req, res) => {
    const userEmail = req.user.email; // from JWT
    const userId = req.user.id;       // keep for frontend
    const { productId, qnty: quantity } = req.body;
    

    if (!productId || !quantity) {
        return res.status(400).json({ 
            message: "Invalid input. Requires a valid userId, productId, and a positive quantity (qnty)." 
        });
    }

    try {
        const updatedCart = await cartRepository.addProductToCart(userEmail, productId, quantity);
        return res.status(200).json({
            message: `Book ${productId} was added/updated to the cart `,
            userId,
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
const userEmail = req.user.email;
const userId = req.user.id;
const { productId } = req.body;


    if (!productId) {
        return res.status(400).json({
            message: "Invalid request body: valid product id is  required"
        })
    }

    try {
        const updatedCart = await cartRepository.removeProductFromCart(userEmail, productId);
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
  const userEmail = req.user.email;
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ message: "ProductId and quantity are required" });
  }

  try {
    const updatedCart = await cartRepository.updateProductQuantity(userEmail, productId, quantity);
    return res.status(200).json({
      message: `Cart updated for product ${productId}`,
      cart: updatedCart
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).json({ message: "Internal server error while updating quantity" });
  }
};


// GET CART for user's email 
export const getCartByUserEmail = async (req, res) => {
  console.log("[CartController] /cart/me called");
  console.log("req.user:", req.user);

  const userEmail = req.user?.email;

  if (!userEmail) {
    console.error("[CartController] No email found in req.user");
    return res.status(400).json({ message: "No email found in token" });
  }

  try {
    const cart = await cartRepository.CartContentByUserEmail(userEmail);
    console.log("[CartController] Cart fetched:", cart);

    if (!cart) {
      return res.status(200).json({ cart: { cartId: null, books: [] } });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error(`[CartController] Error fetching cart for user ${userEmail}:`, error);
    return res.status(500).json({ message: "Internal server error while fetching cart" });
  }
};


// CLEAR UP ACTIVE CART

export const clearCart = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const result = await cartRepository.clearUserCart(userEmail);

    if (result === null) {
      return res.status(200).json({
        success: true,
        message: `No active cart found for user ${userEmail}`
      });
    }

    if (result === true) {
      return res.status(200).json({
        success: true,
        message: `User ${userEmail} cart cleared successfully`
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected response while clearing the cart."
    });
  } catch (error) {
    console.error("[Controller] Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while clearing cart.",
      error: error.message
    });
  }
};

//Merge visitor and user carts
export const mergeCart = async (req, res) => {
  try {
    console.log("[mergeCart] req.user:", req.user);
    console.log("[mergeCart] req.body.items:", req.body.items);

    const userEmail = req.user?.email;
    if (!userEmail) {
      console.error("[mergeCart] No email in JWT payload");
      return res.status(401).json({ message: "Unauthorized: no email in token" });
    }

    const visitorItems = req.body.items;

    if (!Array.isArray(visitorItems)) {
      console.error("[mergeCart] Items not array:", visitorItems);
      return res.status(400).json({ message: "Items must be an array" });
    }

    console.log("[mergeCart] Calling mergeGuestCartIntoUserCart...");
    const result = await cartRepository.mergeGuestCartIntoUserCart(userEmail, visitorItems);
    console.log("[mergeCart] Merge result:", result);

    res.status(200).json({
      message: "Visitor cart merged successfully",
      cart: result.cart,
      stockIssues: result.stockIssues
    });
  } catch (err) {
    console.error("[mergeCart error]", err);
    res.status(500).json({ message: "Server error during cart merge", error: err.message });
  }
};



export default {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartByUserEmail,
    clearCart,
    mergeCart
}