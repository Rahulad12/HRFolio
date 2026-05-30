import jwt from "jsonwebtoken";
import passport from "passport";
import logger from "../utils/logger.js";
import User from "../model/User.js";
import { auditLogService } from "../../modules/audit-logs/index.js";

export const googleLoginRedirect = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const frontendURL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV;
// After Google auth redirects here
export const googleCallback = (req, res, next) => {
  logger.info("Google callback");

  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      logger.error("Error or no user", err || info);
      return res.redirect(
        `${frontendURL}/error?error=${encodeURIComponent(
          err?.message || "User not found"
        )}`
      );
    }

    if (user.status === "inactive") {
      logger.warn("User is banned");
      return res.redirect(
        `${frontendURL}/error?error=${encodeURIComponent(
          "Your account is banned"
        )}`
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    logger.info("Redirecting to frontend with token");
    res.redirect(
      `${frontendURL}/login/?token=${token}&email=${user.email}&name=${user.name}&picture=${user.picture}&loggedIn=${user.isLoggedIn}&Id=${user._id}&role=${user.role}`
    );

    // Centralized Audit Log
    auditLogService.log({
      actor: { id: user._id, name: user.name, role: user.role || 'HR' },
      action: 'AUTH_LOGIN',
      target: { id: user._id, type: 'users', name: user.name }
    });
  })(req, res, next);
};

export const bannedUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const beforeStatus = user.status;
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    await auditLogService.log({
      actor: { id: req.user.id, name: req.user.name || 'Unknown', role: req.user.role },
      action: user.status === 'inactive' ? 'USER_DEACTIVATE' : 'USER_REACTIVATE',
      target: { id: user._id, type: 'users', name: user.name },
      metadata: { before: beforeStatus, after: user.status }
    });

    return res.status(200).json({
      success: true,
      message: `User status updated to ${user.status}`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
