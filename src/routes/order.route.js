import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createOrder, getOrderById, getUserOrders } from "../controllers/order.controller.js";

const router = Router()

router.route('/createOrder').post(verifyJWT,createOrder)
router.route("/getOrder/:orderId").get(verifyJWT, getOrderById);
router.route('/myorders').get(verifyJWT,getUserOrders)
export default router