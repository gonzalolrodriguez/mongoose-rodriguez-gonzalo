import { Router } from "express";
import { getUsers, getUserById, createUser, validateUser, deleteUser, addFavoriteProduct } from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/auth.js";

export const userRoutes = Router();

//rutas de usuario
userRoutes.get("/users", authenticate, getUsers);
userRoutes.get("/users/:id", authenticate, getUserById);
userRoutes.post("/users", validateUser, createUser);
userRoutes.delete("/users/:id", authenticate, deleteUser);
userRoutes.post("/users/favorites", authenticate, addFavoriteProduct);