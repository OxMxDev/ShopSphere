import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductDetails,
    addProductImages,
    removeProductImage,
    createProductReview,
    getProductReviews,
    deleteReview,
    updateStock,
    getLowStockProducts,
    searchProducts,
    getProductsByCategory,
    getProductsByBrand,
    getFeaturedProducts,
    getRelatedProducts
} from "../controllers/product.controller.js";

const router = Router()

// Admin only routes - require authentication and admin role
router.route('/create').post(
    verifyJWT,
    verifyAdmin,
    upload.fields([
        {
            name:"images",
            maxCount:5,
        },
    ]),
    createProduct
)

router.route('/admin/low-stock').get(
    verifyJWT,
    verifyAdmin,
    getLowStockProducts
)

// Public routes - no authentication required
router.route('/getAllProducts').get(getAllProducts)
router.route('/search').get(searchProducts)
router.route('/featured').get(getFeaturedProducts)
router.route('/category/:category').get(getProductsByCategory)
router.route('/brand/:brand').get(getProductsByBrand)
router.route('/:id/related').get(getRelatedProducts)
router.route('/:id').get(getProductById)

// Protected routes - require authentication
router.route('/:id/reviews').post(verifyJWT, createProductReview)
router.route('/:id/reviews').get(getProductReviews)
router.route('/reviews/:reviewId').delete(verifyJWT, deleteReview)

// Admin only product management routes
router.route('/:id').patch(
    verifyJWT,
    verifyAdmin,
    updateProductDetails
)

router.route('/:id').delete(
    verifyJWT,
    verifyAdmin,
    deleteProduct
)

// Admin only image management routes
router.route('/:id/images').post(
    verifyJWT,
    verifyAdmin,
    upload.fields([
        {
            name:"images",
            maxCount:5,
        },
    ]),
    addProductImages
)

router.route('/:id/images/:imageIndex').delete(
    verifyJWT,
    verifyAdmin,
    removeProductImage
)

// Admin only stock management
router.route('/:id/stock').patch(
    verifyJWT,
    verifyAdmin,
    updateStock
)

// Legacy update route (for backward compatibility)
router.route('/update/:id').patch(
    verifyJWT,
    verifyAdmin,
    updateProduct
)

export default router