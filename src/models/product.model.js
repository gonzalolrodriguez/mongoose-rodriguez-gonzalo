import { model, Schema, Types } from "mongoose";

//schema para productos
const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            enum: ['electronics', 'clothing', 'books', 'home', 'sports']
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        seller: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export const ProductModel = model("Product", ProductSchema);
// Eliminación lógica en cascada de órdenes que contienen el producto
ProductSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update && this._update.active === false) {
        const productId = this.getQuery()._id;
        await require('./order.model').OrderModel.updateMany({ 'products.product': productId }, { active: false });
    }
    next();
});