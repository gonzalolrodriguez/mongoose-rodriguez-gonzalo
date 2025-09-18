import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    addProductToFavorites
} from "../controllers/product.controllers.js";
import { validateProduct } from "../controllers/product.controllers.js";
import { authenticate, requireSeller } from "../middlewares/auth.js";

export const productRoutes = Router();

//rutas de producto
productRoutes.post("/products", authenticate, requireSeller, validateProduct, createProduct);
productRoutes.get("/products", getAllProducts);
productRoutes.get("/products/:id", getProductById);
productRoutes.delete("/products/:id", authenticate, requireSeller, deleteProduct);
productRoutes.post("/products/favorites", authenticate, addProductToFavorites);