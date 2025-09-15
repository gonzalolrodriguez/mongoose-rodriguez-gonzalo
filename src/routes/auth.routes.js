import { Router } from "express";
import { login, register } from "../controllers/auth.controllers.js";

export const authRoutes = Router();

//rutas de autenticación
authRoutes.post("/auth/login", login);
authRoutes.post("/auth/register", register);