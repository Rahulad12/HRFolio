import jwt from "jsonwebtoken";
import passport from "passport";
import logger from "../utils/logger.js";
import User from "../model/User.js";
import { auditLogService } from "../../modules/audit-logs/index.js";
import RefreshToken from '../model/RefreshToken.js';
import { generateRefreshToken, hashToken } from '../utils/tokenUtils.js';

export const googleLoginRedirect = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Use only the first origin for OAuth redirects (FRONTEND_URL can be comma-separated for CORS)
const frontendURL = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim();

// After Google auth redirects here
export const googleCallback = (req, res, next) => {
  logger.info("Google callback");

  passport.authenticate("google", { session: false }, async (err, user, info) => {
    try {
      if (err || !user) {
        logger.error("Google callback — no user or error", { err: err?.message, info });
        return res.redirect(
          `${frontendURL}/error?error=${encodeURIComponent(
            err?.message || info?.message || "User not found"
          )}`
        );
      }

      if (user.status === "inactive") {
        logger.warn("Google callback — user is banned", { email: user.email });
        return res.redirect(
          `${frontendURL}/error?error=${encodeURIComponent(
            "Your account is banned"
          )}`
        );
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      const rawRefresh = generateRefreshToken();
      await RefreshToken.create({
        userId: user._id,
        tokenHash: hashToken(rawRefresh),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.cookie('refreshToken', rawRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      logger.info("Google callback — redirecting to frontend", { email: user.email, role: user.role });
      res.redirect(
        `${frontendURL}/login/?token=${token}&email=${user.email}&name=${encodeURIComponent(user.name || '')}&picture=${encodeURIComponent(user.picture || '')}&Id=${user._id}&role=${user.role}`
      );

      // Centralized Audit Log
      auditLogService.log({
        actor: { id: user._id, name: user.name, role: user.role || 'HR' },
        action: 'AUTH_LOGIN',
        target: { id: user._id, type: 'users', name: user.name }
      });
    } catch (callbackErr) {
      logger.error("Google callback — unexpected error", { error: callbackErr?.message });
      if (!res.headersSent) {
        res.redirect(
          `${frontendURL}/error?error=${encodeURIComponent("Login failed. Please try again.")}`
        );
      }
    }
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
    const newStatus = user.status === 'active' ? 'inactive' : 'active';

    if (newStatus === 'inactive') {
      await RefreshToken.updateMany(
        { userId: user._id, revokedAt: null },
        { revokedAt: new Date() }
      );
      logger.info(`Revoked all refresh tokens for deactivated user ${user.email}`);
    }

    user.status = newStatus;
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

export const updateUserRole = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    if (!['HR', 'HR Admin', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const beforeRole = user.role;
    user.role = role;
    await user.save();

    await auditLogService.log({
      actor: { id: req.user.id, name: req.user.name || 'Unknown', role: req.user.role },
      action: 'USER_ROLE_CHANGE',
      target: { id: user._id, type: 'users', name: user.name },
      metadata: { before: beforeRole, after: role }
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: "Name, email, and role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    if (!['HR', 'HR Admin', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.create({ name, email, role, status: 'active' });

    await auditLogService.log({
      actor: { id: req.user.id, name: req.user.name || 'Unknown', role: req.user.role },
      action: 'USER_CREATE',
      target: { id: user._id, type: 'users', name: user.name },
      metadata: { after: { email: user.email, role: user.role } }
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Returns active users filtered by role — accessible to any authenticated user.
// Used by escalation modals to list HR Admins or Admins.
export const getTeamByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const query = { status: 'active' };
    if (role) query.role = role;
    const users = await User.find(query, 'name email role picture').sort({ name: 1 });
    return res.status(200).json({
      success: true,
      message: "Team fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const hashed = hashToken(raw);
    const stored = await RefreshToken.findOne({ tokenHash: hashed });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(stored.userId);
    if (!user || user.status === 'inactive') {
      await RefreshToken.updateMany({ userId: stored.userId }, { revokedAt: new Date() });
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    // Rotate: revoke old, issue new
    stored.revokedAt = new Date();
    await stored.save();

    const newRaw = generateRefreshToken();
    await RefreshToken.create({
      userId: user._id,
      tokenHash: hashToken(newRaw),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie('refreshToken', newRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token: newToken,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    logger.error('Error refreshing token', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (raw) {
      const hashed = hashToken(raw);
      await RefreshToken.updateOne({ tokenHash: hashed }, { revokedAt: new Date() });
    }
    res.clearCookie('refreshToken', { path: '/' });
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
