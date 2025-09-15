import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
} from "../controllers/product.controllers.js";
import { authenticate } from "../middlewares/auth.js";

export const productRoutes = Router();

productRoutes.post("/products", authenticate, createProduct);
productRoutes.get("/products", getAllProducts);
productRoutes.get("/products/:id", getProductById);