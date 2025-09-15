import { model, Schema, Types } from "mongoose";

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

export const UserModel = model("User", UserSchema);