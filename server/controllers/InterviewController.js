import ActivityLog from "../model/ActivityLogs.js";
import Candidate from "../model/Candidate.js";
import Interview from "../model/Interview.js";
import InterviewLog from "../model/interviewLog.js";
import dayjs from "dayjs";

const createInterview = async (req, res) => {
    const { candidate, interviewer, date, time, type, notes, status } = req.body;
    // console.log(req.body)
    // console.log(dayjs(date).isBefore(dayjs()))
    // console.log(dayjs(time).isBefore(dayjs()))
    // console.log(dayjs(` ${date} ${time}`).isBefore(dayjs()))
    // console.log(dayjs().format('YYYY-MM-DD'))
    // console.log(dayjs(date).format('h:mm A'))
    // console.log(dayjs(time).format('h:mm A'))
    if (!candidate || !interviewer || !date || !time || !type || !status) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    try {
        if (dayjs(` ${date} ${time}`).isBefore(dayjs())) {
            return res.status(400).json({ success: false, message: "Cannot schedule interview in the past" });
        }
        const existingInterview = await Interview.findOne({ candidate, date, time }).lean();

        if (existingInterview && existingInterview.status === "scheduled") {
            return res.status(400).json({ success: false, message: "Interview already send on this date for this candidate" });
        }

        if (existingInterview && existingInterview.status === "draft") {
            await Interview.findByIdAndDelete(existingInterview._id);
        }

        const interview = await Interview.create({ candidate, interviewer, date, time, type, notes, status });

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not created" });
        }
        const exstingCandidate = await Candidate.findById(interview.candidate);

        //log the creation
        await InterviewLog.create({
            interviewId: interview._id,
            candidate,
            interviewer,
            action: 'created',
            details: {
                date, time, type, notes, status,
            },
        });

        //log the activity
        await ActivityLog.create({
            candidate: candidate,
            userID: req.user.id,
            action: 'created',
            entityType: 'interviews',
            relatedId: interview._id,
            metaData: {
                title: exstingCandidate?.name,
            },
        })

        return res.status(201).json({
            success: true,
            message: "Interview created successfully",
            data: interview
        });
    } catch (error) {
        console.error("Create interview error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllInterviews = async (req, res) => {
    const { date, status } = req.query;
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
        }).select(' -__v');

        if (interviews.length === 0) {
            return res.status(404).json({ success: false, message: "No interviews found" });

        }
        return res.status(200).json({
            success: true,
            message: "Interviews fetched successfully",
            data: interviews
        });
    } catch (error) {
        console.log("get interview error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id).populate({
            path: "interviewer",
            select: '-createdAt -updatedAt -__v'
        }).populate({
            path: "candidate",
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
        }).select(' -__v');
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
        const updatedInterview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInterview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        await InterviewLog.create({
            interviewId: updatedInterview?._id,
            candidate: updatedInterview?.candidate,
            interviewer: updatedInterview?.interviewer,
            action: 'updated',
            details: {
                date: updatedInterview?.date, time: updatedInterview?.time, type: updatedInterview?.type, notes: updatedInterview?.notes, status: updatedInterview?.status,
                feedback: updatedInterview?.feedback, rating: updatedInterview?.rating
            },
        });
        const existingCandidate = await Candidate.findById(updatedInterview?.candidate);
        await ActivityLog.create({
            candidate: updatedInterview?.candidate,
            userID: req.user.id,
            action: 'updated',
            entityType: 'interviews',
            relatedId: updatedInterview?._id,
            metaData: {
                title: existingCandidate?.name,
            },
        })
        return res.status(200).json({
            success: true,
            message: "Interview updated successfully",
            data: updatedInterview
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const deleteInterview = async (req, res) => {
    try {
        const deleteInterview = await Interview.findByIdAndDelete(req.params.id);
        if (!deleteInterview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        await InterviewLog.create({
            interviewId: deleteInterview._id,
            candidate: deleteInterview.candidate,
            interviewer: deleteInterview.interviewer,
            action: 'deleted',
            details: {
                date: deleteInterview.date, time: deleteInterview.time, type: deleteInterview.type, notes: deleteInterview.notes, status: deleteInterview.status,
                feedback: deleteInterview.feedback, rating: deleteInterview.rating
            },
        });
        return res.status(200).json({
            success: true,
            message: "Interview deleted successfully",
            data: deleteInterview
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getInterviewLog = async (req, res) => {
    console.log("get interview log");
    try {
        const interviewLog = await InterviewLog.find({}).populate
            ({
                path: 'candidate',
                select: '-createdAt -updatedAt -__v'
            }).populate({
                path: 'interviewer',
                select: '-createdAt -updatedAt -__v'
            }).populate({
                path: "interviewId",
                select: '-createdAt -updatedAt -__v'
            }).select(' -__v');
        if (!interviewLog) {
            return res.status(404).json({ success: false, message: "Interview log not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interview log fetched successfully",
            data: interviewLog
        });
    } catch (error) {
        console.log("get interview log error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getInterviewLogByCandidate = async (req, res) => {
    try {
        const interviewLog = await InterviewLog.find({ candidate: req.params.id }).populate
            ({
                path: 'candidate',
                select: '-createdAt -updatedAt -__v'
            }).populate({
                path: 'interviewId',
                select: '-createdAt -updatedAt -__v'
            }).populate({
                path: 'interviewer',
                select: '-createdAt -updatedAt -__v'

            }).select(' -__v');

        if (!interviewLog) {
            return res.status(404).json({ success: false, message: "Interview log not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Interview log fetched successfully",
            data: interviewLog
        });
    } catch (error) {
        console.log("get interview log error", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export { createInterview, getAllInterviews, updateInterview, getInterviewById, getAllInterviewsByCandidate, deleteInterview, getInterviewLog, getInterviewLogByCandidate };

