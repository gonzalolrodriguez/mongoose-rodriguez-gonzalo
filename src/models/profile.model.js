import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const profileSchema = new Schema({
    bio: String,
    avatar: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }
});

export default model('Profile', profileSchema);