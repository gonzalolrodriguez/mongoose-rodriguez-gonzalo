import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";
import { body, validationResult } from 'express-validator';

// Middleware de validación para crear producto
export const validateProduct = [
    body('name').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('category').notEmpty().withMessage('La categoría es obligatoria'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }
        next();
    }
];


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const sellerId = req.userId;

        const seller = await UserModel.findById(sellerId);
        if (seller.userType !== 'seller') {
            return res.status(403).json({
                ok: false,
                msg: "Solo los vendedores pueden crear productos"
            });
        }

        const newProduct = new ProductModel({
            name,
            description,
            price,
            category,
            stock,
            seller: sellerId
        });

        await newProduct.save();

        res.status(201).json({
            ok: true,
            msg: "Producto creado correctamente",
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al crear el producto"
        });
    }
};
// Eliminar producto (lógica y en cascada)
import { OrderModel } from "../models/order.model.js";
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product || product.deleted) {
            return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
        }
        product.deleted = true;
        await product.save();
        // Eliminación en cascada: marcar órdenes que contienen el producto como eliminadas
        await OrderModel.updateMany({ products: id }, { deleted: true });
        res.status(200).json({ ok: true, msg: "Producto eliminado lógicamente y órdenes relacionadas actualizadas" });
    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error al eliminar el producto" });
    }
};

// Agregar producto a favoritos de usuario (N:M)
export const addProductToFavorites = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const product = await ProductModel.findById(productId);
        if (!product || product.deleted) {
            return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
        }
        if (!product.favoritedBy.includes(userId)) {
            product.favoritedBy.push(userId);
            await product.save();
        }
        res.status(200).json({ ok: true, msg: "Usuario agregó el producto a favoritos" });
    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error al agregar favorito" });
    }
};


export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({ active: true }).populate("seller", "username email");

        res.status(200).json({
            ok: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los productos"
        });
    }
};


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id).populate("seller", "username email");

        if (!product || !product.active) {
            return res.status(404).json({
                ok: false,
                msg: "Producto no encontrado"
            });
        }

        res.status(200).json({
            ok: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el producto"
        });
    }
};