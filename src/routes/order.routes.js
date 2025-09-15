import { Router } from "express";
import {
    createOrder,
    getAllOrders,
} from "../controllers/order.controllers.js";
import { authenticate } from "../middlewares/auth.js";

export const orderRoutes = Router();

orderRoutes.post("/orders", authenticate, createOrder);
orderRoutes.get("/orders", authenticate, getAllOrders);