import express from 'express'
import ProductController from '../controllers/product.controller.js'

const router = express.Router()



router.get("/category", ProductController.getAllCategories)
router.post("/filter", ProductController.getFilterProducts);
// router.post("/new", ProductController.addProduct)
router.get("/", ProductController.getAllProducts); 


router.get("/:id", ProductController.getProductById); // has to be bellow  "/"

export default router;

