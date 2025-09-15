import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";


export const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;
        const userId = req.userId;

        let total = 0;
        const orderProducts = [];


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