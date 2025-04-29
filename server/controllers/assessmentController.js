import Assessment from "../model/Assessment.js";
import AssessmentAssignment from "../model/AssessmentAssignment.js";
import Score from "../model/ScoreModle.js";
import sendEmail from "../utils/sendEmail.js";
import EmailTemplate from "../model/EmailTemplate.js";
import Candidate from "../model/Candidate.js";
import dayjs from "dayjs";

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
                message: `Candidate with ID ${duplicateCandidate} is already assigned to the same assessment on ${dayjs(existingAssignment[0].dueDate).format('YYYY-MM-DD')}`,
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
                    if (candidateInfo) {
                        const assessmentTime = new Date(createdAssignment.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        });
                        const assessmentDate = new Date(createdAssignment.createdAt).toLocaleDateString();

                        const html = template.body
                            .replace(/{{candidateName}}/g, candidateInfo.name)
                            .replace(/{{technology}}/g, assessmentDetails.technology || '')
                            .replace(/{{assessmentDate}}/g, assessmentDate)
                            .replace(/{{assessmentTime}}/g, assessmentTime)
                            .replace(/{{assessmentLink}}/g, assessmentDetails.assessmentLink || '')
                            .replace(/{{duration}}/g, assessmentDetails.duration || '')
                            .replace(/{{level}}/g, assessmentDetails.level || '')
                            .replace(/{{deueDate}}/g, dueDate)
                            .replace(/{{type}}/g, assessmentDetails.type || '');

                        const subject = template.subject.replace(/{{technology}}/g, assessmentDetails.technology || 'Assessment');

                        await sendEmail({
                            to: candidateInfo.email,
                            subject,
                            html,
                        });
                    }
                }

                assignments.push(createdAssignment);

            } catch (error) {
                console.error('Assignment Error:', error);
                return res.status(500).json({ success: false, message: error.message });
            }
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

const updateAssignmnet = async (req, res) => {
    try {
        const assignment = await AssessmentAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!assignment) {
            return res.status(400).json({ success: false, message: "Assignment not found" });
        }
        return res.status(200).json({ success: true, message: "Assignment updated successfully", data: assignment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

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

        return res.status(200).json({
            success: true,
            message: "Score created successfully",
            data: createdScore
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

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
export { createAssessment, assignAssessment, getAssessment, getAssignment, deleteAssessment, deleteAssignment, updateAssessment, updateAssignmnet, getAssessmentById, getAssignmentById, createScore, getScoreById, getScore, getAssignmentByCandidateId };