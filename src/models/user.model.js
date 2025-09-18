import { model, Schema, Types } from "mongoose";
import bcrypt from 'bcrypt';

//schema para usuarios
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        street: { type: String },
        city: { type: String },
        country: { type: String }
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
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

// Encriptar password antes de guardar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Eliminación lógica y en cascada de productos y órdenes
UserSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update && this._update.active === false) {
        const userId = this.getQuery()._id;
        // Desactivar productos del vendedor
        await require('./product.model').ProductModel.updateMany({ seller: userId }, { active: false });
        // Desactivar órdenes del usuario
        await require('./order.model').OrderModel.updateMany({ user: userId }, { active: false });
    }
    next();
});

export const UserModel = model("User", UserSchema);