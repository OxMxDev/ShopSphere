import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createReview, deleteReview, getProductReviews, getUserReviews, updateReview } from "../controllers/review.controller.js";

const router = Router()

router.route('/:productId').post(verifyJWT,createReview);
router.route('/getProductReviews/:productId').get(getProductReviews)
router.route("/updateReview/:reviewId").patch(verifyJWT,updateReview);
router.route("/deleteReview/:reviewId").delete(verifyJWT,deleteReview);
router.route('/getUserReviews').get(verifyJWT,getUserReviews)
export default router