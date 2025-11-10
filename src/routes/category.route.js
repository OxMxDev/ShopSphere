import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createCategory } from "../controllers/category.controller.js";
const router = Router()
router
	.route("/createCategory")
	.post(upload.single("image"), verifyJWT, verifyAdmin, createCategory);

export default router