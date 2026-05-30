import express from "express";
import { createEmailTemplate, getAllEmailTemplates, getSingleEmailTemplate, updateEmailTemplate, deleteEmailTemplate } from "../controllers/emailController.js";
import { createGeneralEmail } from "../controllers/GeneralEmailController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const emailRouter = express.Router();

emailRouter.post("/", authenticate, checkUserExist, createEmailTemplate);

emailRouter.get("/", authenticate, checkUserExist, getAllEmailTemplates);

emailRouter.get("/:id", authenticate, checkUserExist, getSingleEmailTemplate);

emailRouter.put("/:id", authenticate, checkUserExist, updateEmailTemplate);

emailRouter.delete("/:id", authenticate, checkUserExist, deleteEmailTemplate);

emailRouter.post("/general/send", authenticate, checkUserExist, createGeneralEmail);




export default emailRouter;