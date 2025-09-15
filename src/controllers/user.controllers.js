import { UserModel } from "../models/user.model.js";
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