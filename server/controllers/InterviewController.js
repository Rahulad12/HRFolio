import Interview from "../model/Interview.js";

const createInterview = async (req, res) => {
    const { candidate, interviewer, date, time } = req.body;
    const interviewername = interviewer.toLowerCase();
    try {
        const interview = new Interview({ candidate, interviewer: interviewername, date, time });
        await interview.save();
        return res.status(201).json({
            success: true,
            message: "Interview created successfully",
            data: interview
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find().populate({
            path: 'candidate',
            select: '-createdAt -updatedAt -__v'
        }).select('-createdAt -updatedAt -__v');
        if (interviews.length === 0) {
            return res.status(404).json({ success: false, message: "No interviews found" });

        }
        return res.status(200).json({
            success: true,
            message: "Interviews fetched successfully",
            data: interviews
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const filterInterviews = async (req, res) => {
    const { date, status, time } = req.query;
    try {
        const interviews = await Interview.find({ date, status, time }).populate('candidate').select('-createdAt -updatedAt -__v');
        if (interviews.length === 0) {
            return res.status(404).json({ success: false, message: "No interviews found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interviews fetched successfully",
            data: interviews
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export { createInterview, getAllInterviews, filterInterviews };

