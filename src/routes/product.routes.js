import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
} from "../controllers/product.controllers.js";
import { authenticate, requireSeller } from "../middlewares/auth.js";

export const productRoutes = Router();

productRoutes.post("/products", authenticate, requireSeller, createProduct);
productRoutes.get("/products", getAllProducts);
productRoutes.get("/products/:id", getProductById);