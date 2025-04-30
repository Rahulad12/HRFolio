import Candidate from "../model/Candidate.js";
import CandidateLog from "../model/CandidateLogs.js";
import EmailTemplate from "../model/EmailTemplate.js";
import Offer from "../model/Offer.js";
import Reference from "../model/Reference.js";
import sendEmail from "../utils/sendEmail.js";
import ActivityLog from "../model/ActivityLogs.js";
const createCandidate = async (req, res) => {
    const {
        name, email, phone,
        technology, level, experience,
        expectedsalary, references, applieddate, resume
    } = req.body;
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
                title: savedCandidate.name
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
// const getAllCandidates = async (req, res) => {
//     try {
//         const candidates = await Candidate.find().select("-createdAt -updatedAt -__v").populate({
//             path: "references",
//             select: "-createdAt -updatedAt -__v -candidate"
//         })
//         if (candidates.length === 0) {
//             return res.status(404).json({ success: false, message: "No candidates found" });
//         }
//         res.status(200).json({
//             success: true,
//             message: "Candidates fetched successfully",
//             data: candidates
//         });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }
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
        return res.status(200).json({ success: true, message: "Candidate deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        if (candidate.status === "hired") {
            const candidateInfo = candidate.name;
            const candidateEmail = candidate.email;

            if (candidateInfo && candidateEmail) {
                const emailTemplate = await EmailTemplate.findOne({ type: "hired" });
                const candidateOffer = await Offer.findOne({ candidate: candidate._id });

                if (!emailTemplate) {
                    return res.status(400).json({ success: false, message: "Hired email template not found" });
                }
                if (!candidateOffer) {
                    return res.status(400).json({ success: false, message: "Candidate offer not found" });
                }

                const emailSubject = emailTemplate.subject;
                const emailBody = emailTemplate.body
                    .replace("{{candidateName}}", candidateInfo)
                    .replace("{{position}}", candidateOffer.position);

                await sendEmail(candidateEmail, emailSubject, emailBody);
            }
        }

        await CandidateLog.create({
            candidate: candidate._id,
            action: 'updated',
            performedAt: Date.now(),
            performedBy: req.user._id,
        })

        await ActivityLog.create({
            candidate: candidate._id,
            userID: req.user._id,
            action: 'updated',
            entityType: 'candidates',
            relatedId: candidate._id,
            metaData: {
                title: candidate.name,
            }
        })


        return res.status(200).json({ success: true, message: "Candidate updated successfully", data: candidate });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};



const filterCandidate = async (req, res) => {
    const { name, technology, level, status } = req.query;

    try {
        // If no filter is passed, you can return an error or return all
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }
        if (technology) {
            query.technology = { $regex: technology, $options: "i" };
        }
        if (level) {
            query.level = { $regex: level, $options: "i" };
        }
        if (status) {
            query.status = { $regex: status, $options: "i" };
        }

        const candidates = await Candidate.find(query).select(
            "-createdAt -updatedAt -__v -references"
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

const getCandidateLogsByCandidateId = async (req, res) => {
    try {
        const candidateLogs = await CandidateLog.find({ candidate: req.params.id }).sort({ createdAt: -1 }).select(' -__v').populate({
            path:"candidate",
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

export { createCandidate, getCandidateById, getAllCandidates, deleteCandidate, filterCandidate, updateCandidate, getCandidateLogsByCandidateId };