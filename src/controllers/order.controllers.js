import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";
import { body, validationResult } from 'express-validator';

// Middleware de validación para crear orden
export const validateOrder = [
    body('products').isArray({ min: 1 }).withMessage('Debe haber al menos un producto'),
    body('shippingAddress.street').notEmpty().withMessage('La calle de envío es obligatoria'),
    body('shippingAddress.city').notEmpty().withMessage('La ciudad de envío es obligatoria'),
    body('shippingAddress.country').notEmpty().withMessage('El país de envío es obligatorio'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }
        next();
    }
];

// Crear un pedido
export const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;
        const userId = req.userId;

        let total = 0;
        const orderProducts = [];

        // Calcular total y verificar stock
        for (const item of products) {
            const product = await ProductModel.findById(item.product);

            if (!product || !product.active) {
                return res.status(404).json({
                    ok: false,
                    msg: `Producto no encontrado: ${item.product}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    ok: false,
                    msg: `Stock insuficiente para: ${product.name}`
                });
            }

            const subtotal = product.price * item.quantity;
            total += subtotal;

            orderProducts.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price
            });

            // Reducir stock
            product.stock -= item.quantity;
            await product.save();
        }

        const newOrder = new OrderModel({
            user: userId,
            products: orderProducts,
            total,
            shippingAddress
        });

        await newOrder.save();

        const orderWithDetails = await OrderModel.findById(newOrder._id)
            .populate("user", "username email")
            .populate("products.product", "name price");

        res.status(201).json({
            ok: true,
            msg: "Pedido creado correctamente",
            data: orderWithDetails
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al crear el pedido"
        });
    }
};

// Obtener todos los pedidos del usuario autenticado
export const getAllOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await OrderModel.find({ user: userId, active: true })
            .populate("user", "username email")
            .populate("products.product", "name price");

        res.status(200).json({
            ok: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los pedidos"
        });
    }
};
// Eliminar orden (lógica)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderModel.findById(id);
        if (!order || order.deleted) {
            return res.status(404).json({ ok: false, msg: "Orden no encontrada" });
        }
        order.deleted = true;
        order.active = false;
        await order.save();
        res.status(200).json({ ok: true, msg: "Orden eliminada lógicamente" });
    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error al eliminar la orden" });
    }
};