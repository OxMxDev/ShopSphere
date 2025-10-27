import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
const router = Router()

router.route('/create').post(
    upload.fields([
        {
            name:"images",
            maxCount:1,
        },
    ]),
    verifyJWT,
    verifyAdmin,
    createProduct
)

router.route('/getAllProducts').get(verifyJWT,getAllProducts)
router.route('/:id').get(verifyJWT,getProductById).patch(verifyJWT,verifyAdmin,updateProduct).delete(verifyJWT,verifyAdmin,deleteProduct)

export default router