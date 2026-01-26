import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createOrder, getOrderById, getUserOrders, updateOrderToPaid, updateOrderToDelivered } from "../controllers/order.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
const router = Router()

router.route('/createOrder').post(verifyJWT,createOrder)
router.route("/getOrder/:orderId").get(verifyJWT, getOrderById);
router.route('/myorders').get(verifyJWT,getUserOrders)
router.route('/updatePaidStatus/:orderId').patch(verifyJWT,updateOrderToPaid)
router.route('/updateDeliveredStatus/:orderId').patch(verifyJWT,verifyAdmin,updateOrderToDelivered)
export default router