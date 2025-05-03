import express from "express";
import sendEmail from "../utils/sendEmail.js";
import EmailTemplate from "../model/EmailTemplate.js";
import { checkUserExist, authenticate } from "../middleware/auhtMiddleware.js";
import { canCandidateProgress } from "../middleware/CandidateProgress.js";
import Candidate from "../model/Candidate.js";
import Offer from "../model/Offer.js";
import ActivityLog from "../model/ActivityLogs.js";
const hiredRouter = express.Router();

hiredRouter.post("/", authenticate, checkUserExist, canCandidateProgress("hired"), async (req, res) => {
    const { candidateId } = req.body;

    if (!candidateId) {
        return res.status(400).json({ success: false, message: "Candidate ID is required" });
    }

    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        const offer = await Offer.findOne({ candidate: candidateId }).lean();
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found for this candidate" });
        }

        const emailTemplate = await EmailTemplate.findOne({ type: "hired" }).lean();
        if (!emailTemplate) {
            return res.status(404).json({ success: false, message: "Email template for 'hired' not found" });
        }

        const body = emailTemplate.body
            .replace(/{{candidateName}}/g, candidate.name || "")
            .replace(/{{startDate}}/g, offer.startDate || "")
            .replace(/{{position}}/g, offer.position || "");

        await sendEmail({ to: candidate.email, subject: emailTemplate.subject, html: body });

        candidate.status = "hired";
        candidate.progress.hired = { completed: true, date: new Date() };
        await candidate.save();

        await ActivityLog.create({
            candidate: candidateId,
            userID: req.user._id,
            action: "hired",
            performedAt: Date.now(),
            metaData: {
                title: candidate.name,
                description: candidate.status
            }
        });

        return res.status(200).json({ success: true, message: "Email sent and candidate marked as hired" });
    } catch (error) {
        console.error("Error in /hired route:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default hiredRouter;
