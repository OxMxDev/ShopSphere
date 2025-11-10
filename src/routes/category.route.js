import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";
const router = Router()
router
	.route("/createCategory")
	.post(upload.single("image"), verifyJWT, verifyAdmin, createCategory);

router.route("/getAllCategories").get(verifyJWT,verifyAdmin, getAllCategories);
router.route("/getCategoryById/:id").get(verifyJWT,verifyAdmin, getAllCategories);
export default router