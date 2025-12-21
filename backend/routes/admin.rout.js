import express from 'express'
import AdminController from '../controllers/admin.controller.js'
import adminController from '../controllers/admin.controller.js';

const router = express.Router()

router.get("/", AdminController.adminGetBooks); 
router.delete("/books/:id", AdminController.adminDeleteBook)
router.post("/books/new", adminController.adminAddBook)
router.put('/books/:id', adminController.adminUpdateBook);

export default router;
