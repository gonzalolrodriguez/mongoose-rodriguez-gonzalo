import { UserModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, msg: 'Email y password requeridos' });
        }
        const user = await UserModel.findOne({ email, active: true });
        if (!user) {
            return res.status(400).json({ ok: false, msg: 'Credenciales inválidas' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ ok: false, msg: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '24h' });
        res.json({ ok: true, msg: 'Login exitoso', data: { token, user: { _id: user._id, username: user.username, email: user.email, userType: user.userType } } });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

export const register = async (req, res) => {
    try {
        const { username, email, password, userType, address } = req.body;
        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ ok: false, msg: 'El email o username ya están en uso' });
        }
        const newUser = new UserModel({ username, email, password, userType: userType || 'customer', address: address || {} });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id, userType: newUser.userType }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '24h' });
        res.status(201).json({ ok: true, msg: 'Usuario creado correctamente', data: { token, user: { _id: newUser._id, username: newUser.username, email: newUser.email, userType: newUser.userType } } });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};
