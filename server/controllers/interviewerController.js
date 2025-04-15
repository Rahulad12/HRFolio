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

export { getInterviewer }