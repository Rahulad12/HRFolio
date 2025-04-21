import express from "express";
import { googleCallback, googleLoginRedirect, bannedUser } from "../controllers/userController.js";
const authRouter = express.Router();

authRouter.get("/google", googleLoginRedirect);

authRouter.get("/google/callback", googleCallback);

authRouter.delete("/:id", bannedUser)

export default authRouter;


