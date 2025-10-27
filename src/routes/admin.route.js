import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { getAllUsers } from "../controllers/admin.controller.js";
const router = Router()

router.route('/getAllUsers').get(verifyJWT,verifyAdmin,getAllUsers)

export default router