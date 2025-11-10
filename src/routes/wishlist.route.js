import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
	addToWishlist,
	removeFromWishlist,
	getUserWishlist,
	moveToCart,
	clearWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/getUserWishlist").get(verifyJWT, getUserWishlist);
router.route("/addToWishlist").post(verifyJWT, addToWishlist);
router.route("/removeFromWishlist").post(verifyJWT, removeFromWishlist);
router.route("/moveToCart").post(verifyJWT, moveToCart);
router.route("/clearWishlist").delete(verifyJWT, clearWishlist);

export default router;
