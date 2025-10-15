import cartRepository from "../repositories/cart.repository.js";

// THIS VERSION RELIES ON THE CLIENT SENDING THE userId IN THE BODY, 
// WHICH IS INSECURE AND SHOULD BE REPLACED WITH A JWT/SESSION CHECK LATER.
export const addToCart = async (req, res) => {

const {userId, productId, qnty: quantity} = req.body;
// SECURITY NOTE: userId should not be retrieved from body 

if(!userId || !productId || !quantity) {

    return res.status(400).json({message: "Invalid input. Requires a valid userId, productId, and a positive quantity (qnty)." });
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

export default {
    addToCart,
}