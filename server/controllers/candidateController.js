import Candidate from "../model/Candidate.js";
import CandidateLog from "../model/CandidateLogs.js";
import Offer from "../model/Offer.js";
import Reference from "../model/Reference.js";
import ActivityLog from "../model/ActivityLogs.js";
import dayjs from "dayjs";
import { sendCandidateEmail } from "../utils/sendCandidateEmailHelper.js";
import { updateCandidateStage, canMoveToStage } from "../utils/updateCandidateStage.js";
import deleteAllRelatedDocs from "../utils/DeleteAllRelatedDocs.js";
/**
 * Creates a new candidate and associated references.
 * Returns a 400 status code if the candidate could not be created or if the
 * applied date is in the future.
 * Returns a 201 status code if the candidate is created successfully.
 * @param {Object} req.body - The request body containing the candidate data.
 * @param {string} req.body.name - The name of the candidate.
 * @param {string} req.body.email - The email address of the candidate.
 * @param {number} req.body.phone - The phone number of the candidate.
 * @param {string} req.body.technology - The technology of the candidate.
 * @param {string} req.body.level - The level of the candidate (junior, mid, senior).
 * @param {number} req.body.experience - The experience of the candidate in years.
 * @param {number} req.body.expectedsalary - The expected salary of the candidate.
 * @param {string} req.body.applieddate - The date the candidate applied.
 * @param {string} req.body.resume - The resume file of the candidate.
 * @param {Object[]} req.body.references - The references of the candidate.
 * @param {string} req.body.references.name - The name of the reference.
 * @param {string} req.body.references.email - The email address of the reference.
 * @param {string} req.body.references.phone - The phone number of the reference.
 * @param {string} req.body.references.relationship - The relationship of the reference to the candidate.
 */
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
            expectedsalary, applieddate, resume, references
        })

        if (!newCandidate) {
            return res.status(400).json({
                success: false,
                message: "Candidate could not be created"
            });
        }
        const savedCandidate = await newCandidate.save();

        // Step 2: Create references and associate with candidate
        // if (references) {
        //     const referenceDocs = await Promise.all(references.map(async (ref) => {
        //         const newRef = await Reference.create({
        //             ...ref,
        //             candidate: savedCandidate._id,
        //         });
        //         return newRef._id;
        //     }));

        //     // Step 3: Update candidate to reference the new reference
        //     savedCandidate.references = referenceDocs;
        //     await savedCandidate.save();
        // }

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

/**
 * Gets a candidate by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} If there is an error while fetching the candidate.
 */
const getCandidateById = async (req, res) => {
    const { id } = req.params;
    try {
        const candidate = await Candidate.findById(id).select("  -__v");
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

/**
 * Gets all candidates with optional filtering by search text and/or status.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} [req.query.searchText] - The search text to filter candidates by.
 * @param {string} [req.query.status] - The status to filter candidates by.
 * @returns {Promise<void>}
 * @throws {Error} If there is an error while fetching the candidates.
 */
const getAllCandidates = async (req, res) => {
    const { searchText, status } = req.query;

    try {
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

/**
 * Deletes a candidate by ID.
 * 
 * This function finds and deletes a candidate from the database using the provided ID.
 * It also logs the deletion activity in both CandidateLog and ActivityLog.
 *
 * @param {Object} req - The request object containing the candidate ID in req.params.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 404 status if the candidate is not found, or a 200 status if the candidate is deleted successfully.
 * In case of an error, it responds with a 500 status and an error message.
 * this functio will delete all selected documents
 */

const deleteCandidates = async (req, res) => {
    const { id: candidateIds } = req.body;
    console.log(candidateIds);
    try {

        if (!Array.isArray(candidateIds)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        if (!candidateIds || candidateIds.length === 0) {
            return res.status(400).json({ success: false, message: "No candidate IDs provided" });
        }

        // Find all candidates with the given IDs and delete them
        const candidates = await Candidate.find({
            _id: { $in: candidateIds }
        });


        if (candidates.length === 0) {
            return res.status(404).json({ success: false, message: "No candidates found with the provided IDs" });
        }

        // Loop through each candidate and perform deletion
        for (let candidate of candidates) {
            await Candidate.findByIdAndDelete(candidate._id);

            // Create a log entry for the deleted candidate
            await CandidateLog.create({
                candidate: candidate._id,
                action: 'deleted',
                performedAt: Date.now(),
                performedBy: req.user._id,
            });

            // Create an activity log for the deleted candidate
            await ActivityLog.create({
                candidate: candidate._id,
                userID: req.user._id,
                action: 'deleted',
                entityType: 'candidates',
                relatedId: candidate._id,
                metaData: {
                    title: candidate.name,
                    description: candidate.status,
                }
            });

            // Delete all related documents
            const result = await deleteAllRelatedDocs(candidate._id);
            if (!result?.success) {
                return res.status(500).json({ success: false, message: result?.message });
            }
        }

        return res.status(200).json({ success: true, message: "Candidates and related docs deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


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

/**
 * Changes the stage of a candidate to a new status.
 * 
 * @param {Object} req - The request object containing the candidate ID in req.params and the new status in req.body.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 400 status if the new status is the same as the current status, or if the candidate cannot be moved to the new stage.
 * Responds with a 404 status if the candidate is not found.
 * Responds with a 200 status if the candidate is updated successfully.
 * In case of an error, it responds with a 500 status and an error message.
 */
const changeCandidateStage = async (req, res) => {
    try {
        const { id: candidateId } = req.params;
        const { status: newStatus } = req.body;

        const candidate = await Candidate.findById(candidateId);

        if (candidate.status === newStatus) {
            return res.status(400).json({ success: false, message: "Cannot move to same stage" });
        }
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
        const offer = await Offer.findOne({ candidate: candidateId });

        if (newStatus === 'hired' && process.env.NODE_ENV === 'production') {
            await sendCandidateEmail('hired', updatedCandidate, offer);
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


/**
 * Gets all logs for a given candidate ID.
 * @param {Object} req - The request object containing the candidate ID in req.params.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 404 status if the candidate logs are not found.
 * Responds with a 200 status if the candidate logs are fetched successfully.
 * In case of an error, it responds with a 500 status and an error message.
 */
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

/**
 * Rejects a candidate with the given ID.
 * @param {Object} req - The request object containing the candidate ID in req.params.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 404 status if the candidate is not found.
 * Responds with a 400 status if the candidate is already rejected.
 * Responds with a 200 status if the candidate is rejected successfully.
 * In case of an error, it responds with a 500 status and an error message.
 */
const rejectCandidate = async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        if (candidate.status === "rejected") {
            return res.status(400).json({ success: false, message: "Candidate already rejected" });
        }

        const offer = await Offer.findOne({ candidate: id }).lean();

        const emailStatus = await sendCandidateEmail("rejection", candidate, offer);

        if (!emailStatus.success) {
            return res.status(400).json({ success: false, message: "Cannot send email and reject candidate" });
        }

        await CandidateLog.create({
            candidate: candidate._id,
            action: 'rejected',
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
            action: 'rejected',
            entityType: 'candidates',
            relatedId: candidate._id,
            metaData: {
                title: candidate.name,
                description: "rejected",
                emailType: "rejection",
            },
        });

        candidate.status = "rejected";
        candidate.progress = {};

        await candidate.save();
        return res.status(200).json({ success: true, message: "Candidate rejected successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });

    }
}


export { createCandidate, getCandidateById, getAllCandidates, deleteCandidates, updateCandidate, getCandidateLogsByCandidateId, changeCandidateStage, rejectCandidate };