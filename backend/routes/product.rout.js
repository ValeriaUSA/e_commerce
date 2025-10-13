import express from 'express'
import ProductController from '../controllers/product.controller.js'

const router = express.Router()

// Get all books 
router.get("/", ProductController.getAllProducts);

//Get all categories
router.get("/category", ProductController.getAllCategories)

// Filter products with query params
router.post("/filter", ProductController.getFilterProducts);

// Get a book by id 
router.get("/:id", ProductController.getProductById);

//Post a new book to catlogue

router.post("/new", ProductController.addProduct)
export default router;