import express from "express";
import { googleCallback, googleLoginRedirect, bannedUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/auhtMiddleware.js";
import { authorize } from "../../shared/middleware/authorize.ts";

const authRouter = express.Router();

authRouter.get("/google", googleLoginRedirect);

authRouter.get("/google/callback", googleCallback);

authRouter.delete("/:id", authenticate, authorize(["Admin"]), bannedUser)

export default authRouter;


