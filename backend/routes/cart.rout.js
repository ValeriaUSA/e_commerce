import express from 'express'
import CartController from '../controllers/cart.controller.js'

const router = express.Router()

// add a book /update qnty in Cart
router.post("/add", CartController.addToCart);


export default router;