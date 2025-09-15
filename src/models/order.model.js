import { model, Schema, Types } from "mongoose";

const OrderSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        products: [{
            product: {
                type: Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }],
        total: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },
        shippingAddress: {
            street: String,
            city: String,
            country: String
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

export const OrderModel = model("Order", OrderSchema);