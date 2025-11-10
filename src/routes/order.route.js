import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router()

router.route('/createOrder').post(verifyJWT,createOrder)

export default router