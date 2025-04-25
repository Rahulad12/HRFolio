import Interviewers from "../model/Interviewers.js";

const getInterviewer = async (req, res) => {
    try {
        const interviewer = await Interviewers.find().select('-createdAt -updatedAt -__v');
        if (interviewer.length === 0) {
            return res.status(404).json({ success: false, message: "Interviewer not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interviewer fetched successfully",
            data: interviewer
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const createInterviewer = async (req, res) => {
    const { name, email, department, availability, position } = req.body;
    try {
        const interviewer = await Interviewers.create({
            name, email, department, availability, position
        })
        if (!interviewer) {
            return res.status(400).json({
                success: false,
                message: "Interviewer not created"
            })
        }
        return res.status(200).json({
            success: "true",
            message: "Interviewer created successfully",
            data: interviewer
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: "false",
            message: "Internal server error"
        })
    }
}
const getInterviewerById = async (req, res) => {
    const id = req.params.id
    try {
        const interviewer = await Interviewers.findById(id);
        if (!interviewer) {
            return res.status(400).json({
                success: "false",
                message: "Interviewer not found"
            })
        }
        return res.status(200).json({
            success: "true",
            message: "Interviewer fetch successfully",
            data: interviewer
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal server error${error}`
        })
    }
}

const updateInterviewer = async (req, res) => {
    try {
        const updateInterviewer = await Interviewers.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateInterviewer) {
            return res.status(404).json({ success: false, message: "Interviewer not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interviewer updated successfully",
            data: updateInterviewer
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const deleteInterviewer = async (req, res) => {
    try {
        const deleteInterviewer = await Interviewers.findByIdAndDelete(req.params.id);
        if (!deleteInterviewer) {
            return res.status(404).json({ success: false, message: "Interviewer not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interviewer deleted successfully",
            data: deleteInterviewer
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { getInterviewer, getInterviewerById, createInterviewer, updateInterviewer, deleteInterviewer }