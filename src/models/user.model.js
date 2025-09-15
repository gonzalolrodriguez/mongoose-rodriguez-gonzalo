import { model, Schema, Types } from "mongoose";
import bcrypt from 'bcrypt';

//schema para usuarios
const UserSchema = new Schema(
    {
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
        userType: {
            type: String,
            enum: ['customer', 'seller', 'admin'],
            default: 'customer'
        },
        address: {
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

// Encriptar password antes de guardar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const UserModel = model("User", UserSchema);