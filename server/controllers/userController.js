import jwt from 'jsonwebtoken';
import passport from 'passport';
import logger from "../utils/logger.js";
import User from '../model/User.js';

export const googleLoginRedirect = passport.authenticate("google", {
    scope: ["profile", "email"],
});

// After Google auth redirects here
export const googleCallback = (req, res, next) => {
    logger.info("Google callback");

    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err || !user) {
            logger.error("Error or no user", err || info);
            return res.redirect(`http://localhost:5173/error?error=${encodeURIComponent(err?.message || "User not found")}`);
        }

        if (user.status === "inactive") {
            logger.warn("User is banned");
            return res.redirect(`http://localhost:5173/error?error=${encodeURIComponent("User is banned")}`);
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        logger.info("Redirecting to frontend with token");
        res.redirect(`http://localhost:5173/?token=${token}&email=${user.email}&name=${user.name}&picture=${user.picture}&loggedIn=${user.isLoggedIn}&Id=${user._id}`);
    })(req, res, next);
};

export const bannedUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.status = user.status === "active" ? "inactive" : "active";
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User status updated to ${user.status}`,
            user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
