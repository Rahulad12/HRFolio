import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String
    }
}, {
    timestamps: true
});


const User = mongoose.model("user", userSchema);
export default User;
