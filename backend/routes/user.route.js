import express from 'express'
import UserController from '../controllers/user.controller.js'

const router = express.Router()

// Register a new user ->Login
router.post("/register", UserController.register);
// router.post("/login", UserController.login);

export default router;
