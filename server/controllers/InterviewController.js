import Interview from "../model/Interview.js";
import Interviewers from "../model/Interviewers.js";

const createInterview = async (req, res) => {
    const { candidate, interviewer, date, time, type, notes } = req.body;
    try {
        const interview = await Interview.create({ candidate, interviewer, date, time, type, notes });

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not created" });
        }

        return res.status(201).json({
            success: true,
            message: "Interview created successfully",
            data: interview
        });
    } catch (error) {
        console.log("get interview error", error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllInterviews = async (req, res) => {
    const { date, status } = req.query;
    console.log("date", date);
    console.log("status", status);
    try {
        const query = {};
        if (date) {
            query.date = date;
        }
        if (status) {
            query.status = status;
        }

        const interviews = await Interview.find({
            ...query
        }).populate({
            path: 'candidate',
            select: '-createdAt -updatedAt -__v'
        }).populate({
            path: 'interviewer',
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
        return res.status(500).json({ success: false, message: error.message });
        console.log("get interview error", error);
    }
}

const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id).populate({
            path: "interviewer",
            select: '-createdAt -updatedAt -__v'
        })
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interview fetched successfully",
            data: interview
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


const getAllInterviewsByCandidate = async (req, res) => {
    try {
        const interviews = await Interview.find({ candidate: req.params.id }).populate({
            path: 'candidate',
            select: '-createdAt -updatedAt -__v'
        }).populate({
            path: 'interviewer',
            select: '-createdAt -updatedAt -__v'
        }).select('-createdAt -updatedAt -__v');
        if (interviews.length === 0) {
            return res.status(404).json({ success: false, message: "No interviews found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interviews fetched successfully",
            data: interviews
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updateInterview = async (req, res) => {
    try {
        const updateInterview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateInterview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interview updated successfully",
            data: updateInterview
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { createInterview, getAllInterviews, updateInterview, getInterviewById, getAllInterviewsByCandidate };

