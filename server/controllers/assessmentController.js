import Assessment from "../model/Assessment.js";
import AssessmentAssignment from "../model/AssessmentAssignment.js";
const createAssessment = async (req, res) => {
    const { assessment, type, technology, level } = req.body
    try {
        const createdAssessment = await Assessment.create({ assessment, type, technology, level });
        if (!createdAssessment) {
            return res.status(400).json({ success: false, message: "Assessment not created" });
        }

        return res.status(200).json({ success: true, message: "Assessment created successfully", data: createdAssessment });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const assignAssessment = async (req, res) => {
    const { candidate, date, assessment } = req.body
    try {
        const assignment = await AssessmentAssignment.create({ candidate, date, assessment });
        if (!assignment) {
            return res.status(400).json({ success: false, message: "Assessment is not Assigned" });
        }

        return res.status(200).json({ success: true, message: "Assessment Assigned successfully" });
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

export { createAssessment, assignAssessment, getAssessment, getAssignment }