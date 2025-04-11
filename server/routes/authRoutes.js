import express from "express";
import { googleCallback, googleLoginRedirect } from "../controllers/userController.js";
const authRouter = express.Router();

authRouter.get("/google", googleLoginRedirect);

authRouter.get("/google/callback", googleCallback);

export default authRouter;


