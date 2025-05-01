import jwt from 'jsonwebtoken';
import User from "../model/User.js";

export const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Forbidden" })
            }
            req.user = decoded
            next()
        })
    } catch (error) {

        res.status(500).json({ success: false, message: error.message });
    }
}


export const checkUserExist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        next();

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}