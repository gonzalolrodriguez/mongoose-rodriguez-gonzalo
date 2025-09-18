import { UserModel } from "../models/user.model.js";
import { body, validationResult } from 'express-validator';

//obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ active: true });
        res.json({
            ok: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los usuarios"
        });
    }
};
export const validateUser = [
    body('username').isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }
        next();
    }
];

//obtener usuario por id
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);

        if (!user || !user.active) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            });
        }

        res.json({
            ok: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el usuario"
        });
    }
};

//crear usuario
export const createUser = async (req, res) => {
    try {
        const { username, email, password, userType, address } = req.body;

        const newUser = new UserModel({
            username,
            email,
            password,
            userType,
            address
        });

        await newUser.save();

        res.status(201).json({
            ok: true,
            msg: "Usuario creado correctamente",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al crear el usuario"
        });
    }
};
// Eliminar usuario (lógica)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user || !user.active) {
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
        }
        user.active = false;
        user.deleted = true;
        await user.save();
        res.status(200).json({ ok: true, msg: "Usuario eliminado lógicamente" });
    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error al eliminar el usuario" });
    }
};

// Agregar producto favorito (N:M)
export const addFavoriteProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user || !user.active) {
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
        }
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
        }
        res.status(200).json({ ok: true, msg: "Producto agregado a favoritos" });
    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error al agregar favorito" });
    }
};