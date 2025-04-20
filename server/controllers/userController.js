import jwt from 'jsonwebtoken';
import passport from 'passport';
import logger from "../utils/logger.js";
import User from '../model/User.js';

// This route will never hit the controller, but we define it for clarity
export const googleLoginRedirect = passport.authenticate("google", {
    scope: ["profile", "email"],
});

// After Google auth redirects here
export const googleCallback = (req, res, next) => {
    logger.info("Google callback");

    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err || !user) {
            logger.error("Error or no user", err);
            res.redirect(`http://localhost:5173/error?error=${err}`);
        }
        console.log(user);
        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        logger.info("Redirecting to frontend");
        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/?token=${token}&email=${user.email}&name=${user.name}&picture=${user.picture}&loggedIn=${user.isLoggedIn}`);

    })(req, res, next);
};

export const bannedUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newUser = User.status === "active" ? "inactive" : "active";
        await newUser.save();

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

