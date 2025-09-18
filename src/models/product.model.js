import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const productSchema = new Schema({
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
        ref: 'User',
        required: true
    },
    favoritedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

const ProductModel = model('Product', productSchema);
export default ProductModel;
export { ProductModel };