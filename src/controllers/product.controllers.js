import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";


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