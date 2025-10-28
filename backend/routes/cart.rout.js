import express from 'express'
import CartController from '../controllers/cart.controller.js'

const router = express.Router()

// add a book /update qnty in Cart
router.post("/add", CartController.addToCart);

//remove a book
router.post("/remove", CartController.removeFromCart)

//update book quantity in cart
router.post("/update", CartController.updateCartQuantity)

//fetch user cart from backend
router.get("/:userId", CartController.getCartByUserId)

export default router;
