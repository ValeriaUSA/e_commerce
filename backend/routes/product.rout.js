import express from 'express'
import ProductController from '../controllers/product.controller.js'

const router = express.Router()

// Get all books 
router.get("/books", ProductController.getAllProducts);

// Get a book by id 
router.get("/books/:id", ProductController.getProductById);

//Post a new book to catlogue

router.post("/books/new", ProductController.addProduct)
export default router;