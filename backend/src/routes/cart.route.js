import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { addProductToCart, removeProductFromCart, getUserCart, updateCartItemQty } from "../controllers/cart.controller.js";
const router = Router() 

router.route('/addToCart').post(verifyJWT,addProductToCart)
router.route('/removeFromCart').post(verifyJWT,removeProductFromCart)
router.route("/getUserCart").get(verifyJWT, getUserCart);
router.post("/update", verifyJWT, updateCartItemQty);

export default router 