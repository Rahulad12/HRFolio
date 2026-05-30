import express from 'express'
import { SearchCandidates } from "../controllers/globalSearch.js";
import { authenticate, checkUserExist } from '../middleware/auhtMiddleware.js';
const searchRouter = express.Router();

searchRouter.get("/",authenticate,checkUserExist,SearchCandidates);

export default searchRouter;