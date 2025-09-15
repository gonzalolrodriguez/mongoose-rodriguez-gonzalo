import { Router } from "express";
import { getUsers, getUserById, createUser } from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/auth.js";

export const userRoutes = Router();

userRoutes.get("/users", authenticate, getUsers);
userRoutes.get("/users/:id", authenticate, getUserById);
userRoutes.post("/users", createUser);