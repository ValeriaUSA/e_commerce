import express from 'express'
import OrderController from '../controllers/order.controller.js'
import { authenticateJWT } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authRole.js";

const router = express.Router()

router.post("/checkout", authenticateJWT, authorizeRole("user"), OrderController.checkout);

export default router;