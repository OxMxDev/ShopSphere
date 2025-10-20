import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
const router = Router()

router.route('/create').post(
    upload.fields([
        {
            name:"image",
            maxCount:1,
        },
    ]),
    createProduct
)
export default router