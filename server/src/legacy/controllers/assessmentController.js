import Assessment from "../model/Assessment.js";
import AssessmentAssignment from "../model/AssessmentAssignment.js";
import Score from "../model/ScoreModle.js";
import sendEmail from "../utils/sendEmail.js";
import EmailTemplate from "../model/EmailTemplate.js";
import Candidate from "../model/Candidate.js";
import dayjs from "dayjs";
import AssessmentLog from "../model/AssessmentLog.js";
import ActivityLog from "../model/ActivityLogs.js";
import { sendCandidateAssignmentEmail } from "../utils/sendCandidateAssignmentEmail.js";
import { updateCandidateCurrentStage } from "../utils/updateCandidateProgress.js";

/**
 * @function createAssessment
 * @description Creates a new assessment
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {string} title - title of the assessment
 * @param {string} type - type of the assessment (behavioural or technical)
 * @param {string} technology - technology of the assessment
 * @param {string} level - level of the assessment (junior, mid, senior)
 * @param {number} duration - duration of the assessment in minutes
 * @param {string} assessmentLink - link of the assessment
 * @returns {Object} - response object with success status and message
 */
const createAssessment = async (req, res) => {
    const { title, type, technology, level, duration, assessmentLink } = req.body
    try {
        const createdAssessment = await Assessment.create({ title, type, technology, level, duration, assessmentLink });
        if (!createdAssessment) {
            return res.status(400).json({ success: false, message: "Assessment not created" });
        }
        return res.status(200).json({ success: true, message: "Assessment created successfully", data: createdAssessment });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


/**
 * Assigns an assessment to one or more candidates.
 * Validates input fields and ensures no duplicate assignments exist for the same candidate and assessment date.
 * Sends an email to each candidate if the environment is production and the status is 'assigned'.
 * Records the assignment activity in the logs.
 * 
 * @param {Object} req - The request object containing assignment details.
 * @param {Object} req.body - The request body.
 * @param {string|string[]} req.body.candidate - Candidate ID(s) to assign the assessment to.
 * @param {string} req.body.assessment - The ID of the assessment.
 * @param {string} req.body.dueDate - The due date for the assessment (format 'YYYY-MM-DD').
 * @param {string} req.body.emailTemplate - The ID of the email template to use.
 * @param {string} req.body.status - The status of the assignment ('assigned', 'pending', or 'completed').
 * @param {Object} res - The response object.
 * 
 * @returns {Object} - Returns a JSON response with success status and message.
 */

const assignAssessment = async (req, res) => {
    let { candidate, assessment, dueDate, emailTemplate, status } = req.body;

    if (!candidate || !assessment || !dueDate || !emailTemplate || !status) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }


    if (!dayjs(dueDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ success: false, message: "Invalid due date format" });
    }

    if (dayjs(dueDate).isBefore(dayjs(), 'day')) {
        return res.status(400).json({ success: false, message: "Due date cannot be in the past" });
    }
    if (!Array.isArray(candidate)) {
        candidate = [candidate];
    }

    try {
        const existingAssignment = await AssessmentAssignment.find({
            candidate: { $in: candidate },
            assessment,
            dueDate,
        });

        const duplicateCandidate = existingAssignment[0]?.candidate?.toString();

        if (existingAssignment.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Candidate with ID ${duplicateCandidate} is already assigned to the same assessment on ${dayjs(existingAssignment[0]?.dueDate).format('YYYY-MM-DD')}`,
            });
        }

        const assessmentDetails = await Assessment.findById(assessment);
        if (!assessmentDetails) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }

        const template = await EmailTemplate.findById(emailTemplate);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Email template not found' });
        }

        const assignments = [];
        
        for (const candidateId of candidate) {
            try {
                const createdAssignment = await AssessmentAssignment.create({
                    candidate: candidateId,
                    assessment,
                    dueDate,
                    emailTemplate,
                    status,
                });

                if (status === 'assigned' && process.env.NODE_ENV === 'production') {
                    const candidateInfo = await Candidate.findById(candidateId);
                    if (!candidateInfo) return res.status(404).json({ success: false, message: 'Candidate not found' });

                    if (candidateInfo?.email) {
                        await sendCandidateAssignmentEmail(candidateInfo, assessmentDetails, template);
                    }
                }

                assignments.push(createdAssignment);

                const existingCanidate = await Candidate.findById(createdAssignment.candidate);
                await AssessmentLog.create({
                    assessment: createdAssignment.assessment,
                    candidate: createdAssignment.candidate,
                    action: 'created',
                    details: { dueDate, status },
                    performedAt: Date.now(),
                    performedBy: req.user._id,
                });

                await ActivityLog.create({
                    candidate: createdAssignment.candidate,
                    userID: req.user._id,
                    action: 'assigned',
                    entityType: 'assessments',
                    relatedId: createdAssignment.assessment,
                    metaData: {
                        title: existingCanidate?.name,
                        dueDate: dueDate,
                        status: status,
                        description: existingCanidate?.status
                    },
                })

            } catch (error) {
                console.error('Assignment Error:', error);
                return res.status(500).json({ success: false, message: error.message });
            }
        }

        if (assignments.length === 0) {
            return res.status(400).json({ success: false, message: "No assessment assigned" });
        }


        return res.status(200).json({
            success: true,
            message: 'Assessment(s) assigned successfully',
            data: assignments,
        });
    } catch (error) {
        console.error('Assignment Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @function getAssessment
 * @description Retrieves all assessments
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - response object with success status and message
 */
const getAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.find({}).select(" -__v");
        if (assessment.length === 0) {
            return res.status(404).json({ success: false, message: "No assessment found" });
        }
        return res.status(200).json({ success: true, message: "Assessment fetched successfully", data: assessment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @function getAssignment
 * @description Retrieves all assignments
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - response object with success status and message
 */
const getAssignment = async (req, res) => {
    try {
        const assignment = await AssessmentAssignment.find({}).select(" -__v").populate({
            path: "candidate",
            select: "-__v"
        }).populate({
            path: "assessment",
            select: " -__v"
        });
        if (assignment.length === 0) {
            return res.status(404).json({ success: false, message: "No assignment found" });
        }
        return res.status(200).json({ success: true, message: "Assignment fetched successfully", data: assignment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @function deleteAssessment
 * @description Deletes an assessment by ID
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {string} req.params.id - The ID of the assessment to delete
 * @returns {Promise<Object>} - response object with success status and message
 */
const deleteAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndDelete(req.params.id);
        if (!assessment) {
            return res.status(404).json({ success: false, message: "Assessment not found" });
        }
        return res.status(200).json({ success: true, message: "Assessment deleted successfully", data: assessment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @function deleteAssignment
 * @description Deletes an assignment by ID
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {string} req.params.id - The ID of the assignment to delete
 * @returns {Promise<Object>} - response object with success status and message
 * 
 * this function will delete respective candidate score as well as the assignment and candidate id
 */

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await AssessmentAssignment.findByIdAndDelete(req.params.id).populate({
            path: "candidate",
            select: " -__v"
        }).populate({
            path: "assessment",
            select: " -__v"
        });

        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        if (assignment) {
            await Score.deleteMany({ candidate: assignment.candidate, assessment: assignment.assessment });
        }


        await AssessmentLog.create({
            assessment: assignment.assessment,
            candidate: assignment.candidate,
            action: 'deleted',
            details: {
                status: "deleted"
            },
            performedAt: Date.now(),
            performedBy: req.user._id,
        })

        const existingCandidate = await Candidate.findById(assignment.candidate);
        await ActivityLog.create({
            candidate: assignment.candidate,
            userID: req.user._id,
            action: 'deleted',
            entityType: 'assessments',
            relatedId: assignment?.assessment,
            metaData: {
                title: existingCandidate?.name,
                status: "deleted",
                description: existingCandidate?.status
            },
        })

        const result = await updateCandidateCurrentStage(assignment.candidate, 'assessment', 'deleted');
        if (!result?.success) {
            return res.status(500).json({ success: false, message: result?.message });
        }
        if (result?.success) {
            return res.status(200).json({ success: true, message: result?.message });
        }

        return res.status(200).json({ success: true, message: "Assignment deleted successfully", data: assignment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!assessment) {
            return res.status(400).json({ success: false, message: "Assessment not found" });
        }
        return res.status(200).json({ success: true, message: "Assessment updated successfully", data: assessment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @function updateAssignmnet
 * @description Updates an assignment by ID
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {string} req.params.id - The ID of the assignment to update
 * @returns {Promise<Object>} - response object with success status and message
 */
const updateAssignmnet = async (req, res) => {
    try {
        const assignment = await AssessmentAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!assignment) {
            return res.status(400).json({ success: false, message: "Assignment not found" });
        }

        await AssessmentLog.create({
            assessment: assignment?.assessment,
            candidate: assignment?.candidate,
            action: 'updated',
            details: {
                status: assignment?.status,
                dueDate: assignment?.dueDate
            },
            performedAt: Date.now(),
            performedBy: req.user._id,
        })
        const existingCandidate = await Candidate.findById(assignment.candidate);


        await ActivityLog.create({
            candidate: assignment?.candidate,
            userID: req.user._id,
            action: 'updated',
            entityType: 'assessments',
            relatedId: assignment?.assessment._id,
            metadata: {
                title: existingCandidate?.name,
                dueDate: assignment?.dueDate,
                status: assignment?.status,
                description: existingCandidate?.status
            }

        })
        return res.status(200).json({ success: true, message: "Assignment updated successfully", data: assignment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Retrieves an assessment by ID.
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {string} req.params.id - The ID of the assessment to fetch
 * @returns {Promise<Object>} - response object with success status and message
 */
const getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id).select(" -__v");
        if (!assessment) {
            return res.status(404).json({ success: false, message: "Assessment not found" });
        }
        return res.status(200).json({ success: true, message: "Assessment fetched successfully", data: assessment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Retrieves all assignments for a given candidate ID.
 * @param {Object} req - The request object containing the candidate ID in req.params.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 404 status if the assignment is not found.
 * Responds with a 200 status if the assignment is fetched successfully.
 * In case of an error, it responds with a 500 status and an error message.
 */
const getAssignmentByCandidateId = async (req, res) => {
    try {
        const assignment = await AssessmentAssignment.find({ candidate: req.params.id }).select(" -__v").populate({
            path: "candidate",
            select: " -__v"
        }).populate({
            path: "assessment",
            select: " -__v"
        });
        if (assignment.length === 0) {
            return res.status(404).json({ success: false, message: "No assignment found" });
        }
        return res.status(200).json({ success: true, message: "Assignment fetched successfully", data: assignment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @function getAssignmentById
 * @description Retrieves an assignment by its ID.
 * @param {Object} req - The request object containing the assignment ID in req.params.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 404 status if the assignment is not found.
 * Responds with a 200 status if the assignment is fetched successfully.
 * In case of an error, it responds with a 500 status and an error message.
 */

const getAssignmentById = async (req, res) => {
    try {
        const assignment = await AssessmentAssignment.findById(req.params.id).select(" -__v").populate({
            path: "candidate",
            select: " -__v"
        }).populate({
            path: "assessment",
            select: " -__v"
        });
        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }
        return res.status(200).json({ success: true, message: "Assignment fetched successfully", data: assignment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Creates a new score for a candidate.
 * Validates input fields and ensures no duplicate scores exist for the same candidate and assessment.
 * Sends a success response if the score is created successfully.
 * If the score is created, it also updates the assignment status to 'evaluated' and records the activity in the logs.
 * In case of an error, it responds with a 500 status and an error message.
 * @param {Object} req.body - The request body containing the score data.
 * @param {string} req.body.candidate - The ID of the candidate.
 * @param {string} req.body.assessment - The ID of the assessment.
 * @param {number} req.body.score - The score given to the candidate.
 * @param {string} req.body.note - The feedback given to the candidate.
 * @returns {Object} - Returns a JSON response with success status and message.
 */
const createScore = async (req, res) => {
    const { candidate, assessment, score, note } = req.body;

    try {
        if (score < 0 || score > 100) {
            return res.status(400).json({ success: false, message: "Score must be between 0 and 100" });
        }

        const existingScore = await Score.findOne({
            candidate,
            assessment
        });
        if (existingScore) {
            return res.status(400).json({ success: false, message: "Score already exists" });
        }
        const createdScore = await Score.create({
            candidate,
            assessment,
            score,
            status: score >= 40 ? "Passed" : "Failed",
            note
        });

        if (!createdScore) {
            return res.status(400).json({ success: false, message: "Score not created" });
        }

        // Update the assignment status to 'evaluated' and attach score
        const assignment = await AssessmentAssignment.findOne({ candidate, assessment });

        if (assignment) {
            assignment.score = score;
            assignment.status = "completed";
            await assignment.save();
        }

        await AssessmentLog.create({
            candidate,
            assessment,
            action: "updated",
            details: {
                score,
                status: score >= 40 ? "Passed" : "Failed",
                feedback: note
            }
        })

        const existingCanidate = await Candidate.findById(candidate);
        await ActivityLog.create({
            candidate: candidate,
            userID: req.user.id,
            action: 'created',
            entityType: 'scores',
            relatedId: createdScore?._id,
            metaData: {
                title: existingCanidate?.name,
                status: createdScore.status,
                description: existingCanidate?.status
            },
        })
        return res.status(200).json({
            success: true,
            message: "Score created successfully",
            data: createdScore
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @function getScoreById
 * @description Retrieves a score by candidate ID.
 * @param {Object} req - The request object containing the candidate ID in req.params.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 404 status if the score is not found.
 * Responds with a 200 status if the score is fetched successfully.
 * In case of an error, it responds with a 500 status and an error message.
 */
const getScoreById = async (req, res) => {
    try {
        const score = await Score.find({ candidate: req.params.id }).select(" -__v").populate({
            path: "candidate",
            select: " -__v"
        }).populate({
            path: "assessment",
            select: " -__v"
        });
        if (score.length === 0) {
            return res.status(404).json({ success: false, message: "No score found" });
        }
        return res.status(200).json({ success: true, message: "Score fetched successfully", data: score });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @function getScore
 * @description Retrieves all scores
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - response object with success status and message
 */
const getScore = async (req, res) => {
    try {
        const score = await Score.find({}).select(" -__v").populate({
            path: "candidate",
            select: "- -__v"
        }).populate({
            path: "assessment",
            select: " -__v"
        });
        if (score.length === 0) {
            return res.status(404).json({ success: false, message: "No score found" });
        }
        return res.status(200).json({ success: true, message: "Score fetched successfully", data: score });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Retrieves assessment logs for a specific candidate by their ID.
 * 
 * @param {Object} req - The request object containing the candidate ID in req.params.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>}
 * 
 * Responds with a 404 status if no assessment logs are found for the candidate.
 * Responds with a 200 status if assessment logs are fetched successfully.
 * In case of an error, it responds with a 500 status and an error message.
 */

const getAssessmentLogByCandidateId = async (req, res) => {
    try {
        const assessmentLog = await AssessmentLog.find({ candidate: req.params.id }).sort({ createdAt: -1 }).select(" -__v").populate({
            path: "candidate",
            select: "-__v"
        }).populate({
            path: "assessment",
            select: " -__v"
        });
        if (assessmentLog.length === 0) {
            return res.status(404).json({ success: false, message: "No assessment log found" });
        }
        return res.status(200).json({ success: true, message: "Assessment log fetched successfully", data: assessmentLog });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export { createAssessment, assignAssessment, getAssessment, getAssignment, deleteAssessment, deleteAssignment, updateAssessment, updateAssignmnet, getAssessmentById, getAssignmentById, createScore, getScoreById, getScore, getAssignmentByCandidateId, getAssessmentLogByCandidateId };