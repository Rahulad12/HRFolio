import ActivityLog from "../model/ActivityLogs.js";
import Candidate from "../model/Candidate.js";
import Interview from "../model/Interview.js";
import InterviewLog from "../model/interviewLog.js";
import dayjs from "dayjs";
import { updateCandidateProgress } from "../utils/updateCandidateProgress.js";
import { sendInterviewEmail } from "../utils/sendInterviewScheduleEmailHelper.js";
import Interviewers from "../model/Interviewers.js";

const createInterview = async (req, res) => {
    const { candidate, interviewer, date, time, type, notes, status, InterviewRound } = req.body;

    if (!candidate || !interviewer || !date || !time || !type || !status) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // 1. Prevent past interviews
        if (dayjs(`${date} ${time}`).isBefore(dayjs())) {
            return res.status(400).json({ success: false, message: "Cannot schedule interview in the past" });
        }

        // 2. Fetch candidate's interview history
        const interviews = await Interview.find({ candidate });

        const stageCompleted = (stage) =>
            interviews.some(int => int.InterviewRound === stage && int.status === "completed");

        // 3. Enforce round progression rules
        if (InterviewRound === "second" && !stageCompleted("first")) {
            return res.status(400).json({
                success: false,
                message: "First round interview must be completed before scheduling second round."
            });
        }

        if (InterviewRound === "third" && !stageCompleted("second")) {
            return res.status(400).json({
                success: false,
                message: "Second round interview must be completed before scheduling third round."
            });
        }

        // 4. Check for existing scheduled/draft interviews in the same round
        const existingInterview = await Interview.findOne({ candidate, InterviewRound }).lean();

        if (existingInterview) {
            return res.status(400).json({
                success: false,
                message: `Check your schedule. ${InterviewRound} interview is already scheduled.`
            });
        }

        if (existingInterview && existingInterview.status === "draft") {
            await Interview.findByIdAndDelete(existingInterview._id);
        }

        // 5. Create interview
        const interview = await Interview.create({
            candidate,
            interviewer,
            date,
            time,
            type,
            notes,
            status,
            InterviewRound
        });

        if (!interview) {
            return res.status(500).json({ success: false, message: "Interview not created" });
        }

        // 6. Update candidate status
        const candidateInfo = await Candidate.findById(candidate);
        if (candidateInfo) {
            candidateInfo.status = InterviewRound;
            await candidateInfo.save();
        }

        //send Email to the Candidate
        const interviewerInfo = await Interviewers.findOne({
            _id: interviewer
        }).lean();
        console.log(interviewerInfo);
        console.log(candidateInfo);
        console.log(interview);
        console.log(InterviewRound);
        await sendInterviewEmail(candidateInfo, interview, interviewerInfo, InterviewRound);

        // 7. Log interview creation
        await InterviewLog.create({
            interviewId: interview._id,
            candidate,
            interviewer,
            action: 'created',
            details: { date, time, type, notes, status, interviewRound: InterviewRound },
        });

        // 8. Log activity
        await ActivityLog.create({
            candidate,
            userID: req.user.id,
            action: 'created',
            entityType: 'interviews',
            relatedId: interview._id,
            metaData: {
                title: candidateInfo?.name,
                description: candidateInfo?.status,
                interviewRound: InterviewRound
            }
        });

        return res.status(201).json({
            success: true,
            message: "Interview created successfully",
            data: interview
        });

    } catch (error) {
        console.error("Create interview error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default createInterview;

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
        //check if status is completed and update candidate progress to completed
        const status = updatedInterview?.status;
        if (status === 'completed') {
            await updateCandidateProgress(updatedInterview?.candidate, updatedInterview?.InterviewRound);
        }

        // Log interview update
        await InterviewLog.create({
            interviewId: updatedInterview?._id,
            candidate: updatedInterview?.candidate,
            interviewer: updatedInterview?.interviewer,
            action: 'updated',
            details: {
                date: updatedInterview?.date, time: updatedInterview?.time, type: updatedInterview?.type, notes: updatedInterview?.notes, status: updatedInterview?.status,
                feedback: updatedInterview?.feedback, rating: updatedInterview?.rating, interviewRound: updatedInterview?.InterviewRound
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
                description: existingCandidate?.status,
                interviewRound: updatedInterview?.InterviewRound
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
                feedback: deleteInterview.feedback, rating: deleteInterview.rating, interviewRound: deleteInterview.InterviewRound
            },
        });

        const existingCandidate = await Candidate.findById(deleteInterview.candidate);
        await ActivityLog.create({
            candidate: deleteInterview.candidate,
            userID: req.user.id,
            action: 'deleted',
            entityType: 'interviews',
            relatedId: deleteInterview._id,
            metaData: {
                title: existingCandidate?.name,
                description: existingCandidate?.status,
                interviewRound: deleteInterview.InterviewRound
            },
        })
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
        const interviewLog = await InterviewLog.find({ candidate: req.params.id }).sort({ createdAt: -1 }).populate
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

