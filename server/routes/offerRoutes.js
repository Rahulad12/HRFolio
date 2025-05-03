import express from "express";
import { createOffer, getOffer, getOfferByCandidates, getOfferById, updateOffer, delteOffer, getOfferLogsByCandidate } from '../controllers/offerController.js'
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";
import { canCandidateProgress } from "../middleware/CandidateProgress.js";
const offerRouter = express.Router();

offerRouter.post("/", authenticate, checkUserExist, canCandidateProgress("offered"), createOffer);
offerRouter.get("/", authenticate, checkUserExist, getOffer);

offerRouter.get("/candidate/:id", authenticate, checkUserExist, getOfferByCandidates);
offerRouter.get("/log/candidate/:id", authenticate, checkUserExist, getOfferLogsByCandidate);

offerRouter.get("/:id", authenticate, checkUserExist, getOfferById);
offerRouter.put("/:id", authenticate, checkUserExist, updateOffer);
offerRouter.delete("/:id", authenticate, checkUserExist, delteOffer);

export default offerRouter;

