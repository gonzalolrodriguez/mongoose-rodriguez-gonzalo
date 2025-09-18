import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const orderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: Types.ObjectId,
        ref: 'Product',
        required: true
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
        street: { type: String },
        city: { type: String },
        country: { type: String }
    },
    active: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

const OrderModel = model('Order', orderSchema);
export default OrderModel;
export { OrderModel };