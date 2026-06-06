import express from "express";
import { googleCallback, googleLoginRedirect, createUser, bannedUser, updateUserRole, getAllUsers, getTeamByRole, refreshToken, logout } from "../controllers/userController.js";
import { authenticate } from "../middleware/auhtMiddleware.js";
import { authorize } from "../../shared/middleware/authorize.ts";
import { getMyPermissions, getAllRolePermissions, updateRolePermission } from "../controllers/permissionController.js";

const authRouter = express.Router();

authRouter.get("/google", googleLoginRedirect);

authRouter.get("/google/callback", googleCallback);

// Returns active users by role — accessible to any authenticated user (for escalation modals)
authRouter.get("/team", authenticate, getTeamByRole);

authRouter.get("/users", authenticate, authorize(["Admin"]), getAllUsers)
authRouter.post("/users", authenticate, authorize(["Admin"]), createUser)
authRouter.delete("/:id", authenticate, authorize(["Admin"]), bannedUser)
authRouter.patch("/:id/role", authenticate, authorize(["Admin"]), updateUserRole)

authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logout);

authRouter.get("/me/permissions", authenticate, getMyPermissions)
authRouter.get("/role-permissions", authenticate, authorize(["Admin"]), getAllRolePermissions)
authRouter.patch("/role-permissions", authenticate, authorize(["Admin"]), updateRolePermission)

export default authRouter;


