import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { addProductToCart, removeProductFromCart } from "../controllers/cart.controller.js";
const router = Router()

router.route('/addToCart/:productId').post(verifyJWT,verifyAdmin,addProductToCart)
router.route('/removeFromCart/:productId').post(verifyJWT,verifyAdmin,removeProductFromCart)

export default router