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
    picture: {
        type: String
    },
    role: {
        type: String,
        enum: ["HR", "HR Admin", "Admin"]
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});


const User = mongoose.model("users", userSchema);
export default User;
