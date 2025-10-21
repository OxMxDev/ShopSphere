import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
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

router.route('/getAllProducts').get(getAllProducts)
router.route('/:id').get(getProductById).patch(updateProduct).delete(deleteProduct)

export default router