import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        role: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },
        avatarUrl: String,
        departament: {
            type: String,
            require: true,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Users', UserSchema);