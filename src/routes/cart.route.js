import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { addProductToCart, removeProductFromCart } from "../controllers/cart.controller.js";
const router = Router() 

router.route('/addToCart').post(verifyJWT,addProductToCart)
router.route('/removeFromCart').post(verifyJWT,removeProductFromCart)

export default router 