import express from "express";
import { createOffer, getOffer, getOfferByCandidates, getOfferById, updateOffer } from '../controllers/offerController.js'
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";
const offerRouter = express.Router();

offerRouter.post("/", authenticate, checkUserExist, createOffer);
offerRouter.get("/", authenticate, checkUserExist, getOffer);
offerRouter.get("/:id", authenticate, checkUserExist, getOfferById);
offerRouter.get("/candidate/:id", authenticate, checkUserExist, getOfferByCandidates);
offerRouter.put("/:id", authenticate, checkUserExist, updateOffer);

export default offerRouter;

