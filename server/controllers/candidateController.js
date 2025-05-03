import Candidate from "../model/Candidate.js";
import CandidateLog from "../model/CandidateLogs.js";
import EmailTemplate from "../model/EmailTemplate.js";
import Offer from "../model/Offer.js";
import Reference from "../model/Reference.js";
import ActivityLog from "../model/ActivityLogs.js";
import dayjs from "dayjs";
import { sendCandidateEmail } from "../utils/sendCandidateEmailHelper.js";
import { updateCandidateStage, canMoveToStage } from "../utils/updateCandidateStage.js";
const createCandidate = async (req, res) => {
    const {
        name, email, phone,
        technology, level, experience,
        expectedsalary, references, applieddate, resume
    } = req.body;

    if (!name || !email || !phone || !technology || !level || !experience || !expectedsalary || !applieddate || !resume) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    if (dayjs(applieddate).isAfter(dayjs())) {
        return res.status(400).json({
            success: false,
            message: "Applied date cannot be in the future"
        });
    }

    try {
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({
                success: false,
                message: "Candidate with this email already exists"
            });
        }

        // Step 1: Create candidate without reference
        const newCandidate = new Candidate({
            name, email, phone,
            technology, level, experience,
            expectedsalary, applieddate, resume
        })

        if (!newCandidate) {
            return res.status(400).json({
                success: false,
                message: "Candidate could not be created"
            });
        }
        const savedCandidate = await newCandidate.save();

        // Step 2: Create references and associate with candidate
        if (references) {
            const referenceDocs = await Promise.all(references.map(async (ref) => {
                const newRef = await Reference.create({
                    ...ref,
                    candidate: savedCandidate._id,
                });
                return newRef._id;
            }));

            // Step 3: Update candidate to reference the new reference
            savedCandidate.references = referenceDocs;
            await savedCandidate.save();
        }

        await CandidateLog.create({
            candidate: savedCandidate._id,
            action: 'created',
            performedAt: Date.now(),
            performedBy: req.user._id,
        })

        await ActivityLog.create({
            candidate: savedCandidate._id,
            userID: req.user._id,
            action: 'created',
            entityType: 'candidates',
            relatedId: savedCandidate._id,
            metaData: {
                title: savedCandidate.name,
                description: savedCandidate.status
            }
        })

        // Step 4: Respond
        return res.status(201).json({
            success: true,
            message: "Candidate created successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getCandidateById = async (req, res) => {
    const { id } = req.params;
    try {
        const candidate = await Candidate.findById(id).select("  -__v").populate({
            path: "references",
            select: "-createdAt -updatedAt -__v -candidate"
        });
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        res.status(200).json({
            success: true,
            message: "Candidate fetched successfully",
            data: candidate
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const getAllCandidates = async (req, res) => {
    const { searchText, status } = req.query;

    try {
        // If no filter is passed, you can return an error or return all
        const query = {};

        if (searchText) {
            query.$or = [
                { name: { $regex: searchText, $options: "i" } },
                { technology: { $regex: searchText, $options: "i" } },
                { level: { $regex: searchText, $options: "i" } },
            ];
        }

        if (status) {
            query.status = { $regex: status, $options: "i" };
        }

        const candidates = await Candidate.find(query).select(
            " -__v -references"
        );

        if (!candidates.length) {
            return res
                .status(404)
                .json({ success: false, message: "No candidates found" });
        }

        return res.status(200).json({
            success: true,
            message: "Candidates fetched successfully",
            data: candidates,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }
        await CandidateLog.create({
            candidate: candidate._id,
            action: 'deleted',
            performedAt: Date.now(),
            performedBy: req.user._id,
        })

        await ActivityLog.create({
            candidate: candidate._id,
            userID: req.user._id,
            action: 'deleted',
            entityType: 'candidates',
            relatedId: candidate._id,
            metaData: {
                title: candidate.name,
                description: candidate.status
            }
        })
        return res.status(200).json({ success: true, message: "Candidate deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Updates a candidate with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} If the candidate is not found.
 * @throws {Error} If the new status is not allowed based on the current progress.
 * @throws {Error} If there is an error while saving the candidate.
 * @throws {Error} If there is an error while sending the email.
 */
const updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }
        // Send email if candidate is hired or rejected

        // Log the update
        await CandidateLog.create({
            candidate: candidate._id,
            action: 'updated',
            performedAt: Date.now(),
            performedBy: req.user._id,
        });

        await ActivityLog.create({
            candidate: candidate._id,
            userID: req.user._id,
            action: 'updated',
            entityType: 'candidates',
            relatedId: candidate._id,
            metaData: {
                title: candidate.name,
                description: candidate.status
            },
        });

        return res.status(200).json({
            success: true,
            message: "Candidate updated successfully",
            data: candidate,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const changeCandidateStage = async (req, res) => {
    try {
        const { id: candidateId } = req.params;
        const { status: newStatus } = req.body;

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        // Check if the candidate can be moved to the new stage
        const canUpdate = canMoveToStage(candidate.status, newStatus, candidate.progress);
        if (!canUpdate) {
            return res.status(400).json({
                success: false,
                message: `Cannot move to '${newStatus}' from '${candidate.status}'`,
            });
        }

        // Update candidate stage
        const updatedCandidate = await updateCandidateStage(candidateId, newStatus);

        // Handle rejection email and logs in production only
        if (newStatus === "rejected" && process.env.NODE_ENV === "production") {
            const offer = await Offer.findOne({ candidate: candidate._id }).lean();
            const emailStatus = await sendCandidateEmail("rejection", candidate, offer);

            if (!emailStatus.success) {
                return res.status(400).json({ success: false, message: emailStatus.message });
            }

            // Log email and rejection
            await CandidateLog.create({
                candidate: candidate._id,
                action: 'created',
                performedAt: Date.now(),
                performedBy: req.user._id,
                metaData: {
                    emailStatus: emailStatus.message,
                    emailType: "rejection",
                },
            });

            await ActivityLog.create({
                candidate: candidate._id,
                userID: req.user._id,
                action: 'created',
                entityType: 'candidates',
                relatedId: candidate._id,
                metaData: {
                    title: candidate.name,
                    description: newStatus,
                    emailType: "rejection",
                },
            });

            // Clear candidate progress after rejection
            candidate.progress = {};
            await candidate.save(); // Ensure progress reset is saved
        }

        // General update logs (for all status changes)
        await CandidateLog.create({
            candidate: candidate._id,
            action: 'updated',
            performedAt: Date.now(),
            performedBy: req.user._id,
        });

        await ActivityLog.create({
            candidate: candidate._id,
            userID: req.user._id,
            action: 'updated',
            entityType: 'candidates',
            relatedId: candidate._id,
            metaData: {
                title: candidate.name,
                description: newStatus,
            },
        });

        return res.status(200).json({
            success: true,
            message: `Candidate updated successfully to ${newStatus}`,
            data: updatedCandidate,
        });
    } catch (err) {
        console.error("Error in changeCandidateStage:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getCandidateLogsByCandidateId = async (req, res) => {
    try {
        const candidateLogs = await CandidateLog.find({ candidate: req.params.id }).sort({ createdAt: -1 }).select(' -__v').populate({
            path: "candidate",
            select: "-__v"
        });
        if (!candidateLogs) {
            return res.status(404).json({ success: false, message: "Candidate logs not found" });
        }
        return res.status(200).json({ success: true, message: "Candidate logs fetched successfully", data: candidateLogs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { createCandidate, getCandidateById, getAllCandidates, deleteCandidate, updateCandidate, getCandidateLogsByCandidateId, changeCandidateStage };