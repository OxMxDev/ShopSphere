import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createOrder, getOrderById } from "../controllers/order.controller.js";

const router = Router()

router.route('/createOrder').post(verifyJWT,createOrder)
router.route("/getOrder/:orderId").get(verifyJWT, getOrderById);
export default router