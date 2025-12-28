import express from 'express'
import AdminController from '../controllers/admin.controller.js'
import { authenticateJWT } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authRole.js";

const router = express.Router()

router.get("/", AdminController.adminGetBooks); 
router.delete("/books/:id", authenticateJWT, authorizeRole("admin"), AdminController.adminDeleteBook)
router.post("/books/new", authenticateJWT, authorizeRole("admin"), AdminController.adminAddBook)
router.put("/books/:id", authenticateJWT, authorizeRole("admin"), AdminController.adminUpdateBook);

export default router;

