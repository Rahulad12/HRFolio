import Assessment from "../model/Assessment.js";
import AssessmentAssignment from "../model/AssessmentAssignment.js";
import Score from "../model/ScoreModle.js";
const createAssessment = async (req, res) => {
    const { title, type, technology, level } = req.body
    try {
        const createdAssessment = await Assessment.create({ title, type, technology, level });
        if (!createdAssessment) {
            return res.status(400).json({ success: false, message: "Assessment not created" });
        }

        return res.status(200).json({ success: true, message: "Assessment created successfully", data: createdAssessment });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const assignAssessment = async (req, res) => {
    let { candidate, assessment, date } = req.body

    if (!Array.isArray(candidate)) {
        candidate = [candidate];
    }
    try {
        const existingAssignment = await AssessmentAssignment.find({ candidate: { $in: candidate }, assessment, date });

        if (existingAssignment.length > 0) {
            return res.status(400).json({ success: false, message: `Candidate ${candidate.indexOf(existingAssignment[0].candidate)} already assigned to assessment on ${new Date(date).toLocaleDateString()}` });
        }

        const assignments = await Promise.all(
            candidate.map(async (candidateId) => {
                return await AssessmentAssignment.create({
                    candidate: candidateId,
                    assessment,
                    date
                });
            })
        )

        return res.status(200).json({ success: true, message: "Assessment Assigned successfully", data: assignments });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.find({}).select("-createdAt -updatedAt -__v");
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
        const assignment = await AssessmentAssignment.find({}).select("-createdAt -updatedAt -__v").populate({
            path: "candidate",
            select: "-createdAt -updatedAt -__v"
        }).populate({
            path: "assessment",
            select: "-createdAt -updatedAt -__v"
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
            select: "-createdAt -updatedAt -__v"
        }).populate({
            path: "assessment",
            select: "-createdAt -updatedAt -__v"
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
        const assessment = await Assessment.findById(req.params.id).select("-createdAt -updatedAt -__v");
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
        const assignment = await AssessmentAssignment.find({ candidate: req.params.id }).select("-createdAt -updatedAt -__v").populate({
            path: "candidate",
            select: "-createdAt -updatedAt -__v"
        }).populate({
            path: "assessment",
            select: "-createdAt -updatedAt -__v"
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
        const assignment = await AssessmentAssignment.findById(req.params.id).select("-createdAt -updatedAt -__v").populate({
            path: "candidate",
            select: "-createdAt -updatedAt -__v"
        }).populate({
            path: "assessment",
            select: "-createdAt -updatedAt -__v"
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
    const { candidate, assessment, score } = req.body;
    try {
        if (score < 0 || score > 100) return res.status(400).json({ success: false, message: "Score must be between 0 and 100" });
        const createdScore = await Score.create({ candidate, assessment, score, status: score >= 40 ? "Passed" : "Failed" });
        if (!createdScore) {
            return res.status(400).json({ success: false, message: "Score not created" });
        }
        return res.status(200).json({ success: true, message: "Score created successfully", data: createdScore });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getScoreById = async (req, res) => {
    try {
        const score = await Score.find({ candidate: req.params.id }).select("-createdAt -updatedAt -__v").populate({
            path: "candidate",
            select: "-createdAt -updatedAt -__v"
        }).populate({
            path: "assessment",
            select: "-createdAt -updatedAt -__v"
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
        const score = await Score.find({}).select("-createdAt -updatedAt -__v").populate({
            path: "candidate",
            select: "-createdAt -updatedAt -__v"
        }).populate({
            path: "assessment",
            select: "-createdAt -updatedAt -__v"
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