import express from 'express'
import CartController from '../controllers/cart.controller.js'
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router()

// add a book /update qnty in Cart
router.post("/add", authenticateJWT, CartController.addToCart);

//remove a book
router.post("/remove", authenticateJWT, CartController.removeFromCart)

//clear up cart completely [not delete]
router.post("/clear", authenticateJWT, CartController.clearCart)

//update book quantity in cart
router.post("/update", authenticateJWT, CartController.updateCartQuantity)

//fetch user cart from backend
router.get("/me", authenticateJWT, CartController.getCartByUserEmail)

export default router;
