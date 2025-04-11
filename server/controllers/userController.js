import jwt from 'jsonwebtoken';
import passport from 'passport';
// This route will never hit the controller, but we define it for clarity
export const googleLoginRedirect = passport.authenticate("google", {
    scope: ["profile", "email"],
});

// After Google auth redirects here
export const googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                success: false,
                message: "Something is not right",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/?token=${token}&email=${user.email}&username=${user.username}`);

    })(req, res, next);
};
