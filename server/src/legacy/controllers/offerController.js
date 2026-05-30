import Candidate from "../model/Candidate.js";
import EmailTemplate from "../model/EmailTemplate.js";
import Offer from "../model/Offer.js";
import OfferLog from "../model/offerLogs.js";
import sendEmail from "../utils/sendEmail.js";
import ActivityLog from "../model/ActivityLogs.js";
import dayjs from "dayjs";
import { updateCandidateCurrentStage } from "../utils/updateCandidateProgress.js";

/**
 * This function will create a offer 
 * @params req.body
 * @returns offer
 * if email not send offer also will be saved in database
 * return false when offer exists, not created,no send email 
 */
const createOffer = async (req, res) => {
    const { candidate, email, position, salary, startDate, responseDeadline, status } = req.body;
    if (!candidate || !email || !position || !salary || !startDate || !responseDeadline || !status) {
        return res.status(400).json({
            message: 'All fields are required.',
            success: false,
        });
    }

    try {
        if (dayjs(startDate).isBefore(dayjs().startOf('day'))) {
            return res.status(400).json({
                message: 'Start date cannot be in the past.',
                success: false,
            });
        }
        if (dayjs(responseDeadline).isBefore(dayjs().startOf('day'))) {
            return res.status(400).json({
                message: 'Response deadline cannot be in the past.',
                success: false,
            });
        }

        if (dayjs(responseDeadline).isAfter(dayjs(startDate))) {
            return res.status(400).json({
                message: 'Response deadline cannot be After start date.',
                success: false,
            });
        }

        const existingOffer = await Offer.findOne({ candidate });

        if (existingOffer) {
            return res.status(400).json({
                message: 'Offer has already been sent to this candidate.',
                success: false,
            });
        }

        /**
         * this function delete the drafted offer from hte existing offer of particular candidate
         * when new offer is sent
         */
        if (existingOffer && existingOffer.status === 'draft') {
            await Offer.findByIdAndDelete(existingOffer._id);
        }

        /**
         * Create new offer
         */
        const newOffer = await Offer.create({
            candidate,
            email,
            position,
            salary,
            startDate,
            responseDeadline,
            status,
        });

        if (!newOffer) {
            return res.status(400).json({
                message: 'Failed to create offer.',
                success: false,
            });
        }


        /**
         * Update candidate current stage to offerd when offer is sent
         */
        const candidateInfo = await Candidate.findById(candidate);
        if (newOffer.status === 'sent') {
            candidateInfo.status = 'offered';
            await candidateInfo.save();
        }

        /**
         * Send offer email to the candidate
         */
        if (newOffer.status === 'sent' && process.env.NODE_ENV === 'production') {
            const emailTemplate = await EmailTemplate.findById(email);

            if (candidateInfo && emailTemplate) {
                const html = emailTemplate.body
                    .replace(/{{candidateName}}/g, candidateInfo.name)
                    .replace(/{{position}}/g, position)
                    .replace(/{{salary}}/g, salary)
                    .replace(/{{startDate}}/g, startDate)
                    .replace(/{{responseDeadline}}/g, responseDeadline)
                    .replace(/{{offerDate}}/g, dayjs().format('MMMM D, YYYY'))
                    .replace(/{{offerTime}}/g, dayjs().format('hh:mm A'));

                const subject = emailTemplate.subject.replace(/{{position}}/g, position);

                await sendEmail({
                    to: candidateInfo.email,
                    subject: subject,
                    html,
                });
            }
        }

        //logs of offer
        await OfferLog.create({
            candidate: candidate,
            offer: newOffer?._id,
            action: 'created',
            performedAt: Date.now(),
            performedBy: req.user._id,
            details: {
                status: newOffer?.status,
                salary: newOffer?.salary,
                joinedDate: newOffer?.startDate,
                responseDeadline: newOffer?.responseDeadline
            }
        })
        await ActivityLog.create({
            candidate: candidate,
            userID: req.user._id,
            action: 'created',
            entityType: 'offers',
            relatedId: newOffer?._id,
            metaData: {
                title: candidateInfo?.name,
                status: newOffer?.status,
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Offer created successfully',
            data: newOffer,
        });
    } catch (error) {
        console.error('Offer creation failed:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong while creating the offer',
        });
    }
};


const getOffer = async (req, res) => {
    try {
        const offer = await Offer.find().select(' -__v').populate({
            path: "candidate",
            select: " -__v"
        })
        if (offer.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer fetched successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id).select(' -__v');
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer fetched successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getOfferByCandidates = async (req, res) => {
    try {
        const offer = await Offer.find({ candidate: req.params.id }).select(' -__v');
        if (offer.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer fetched successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateOffer = async (req, res) => {
    const { candidate, status } = req.body;

    if (!candidate || !status) {
        return res.status(400).json({ success: false, message: "Candidate and status are required" });
    }

    try {

        if (status === "accepted") {
            await updateCandidateCurrentStage(candidate, 'offered', 'updated');
        }
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        //logs of offer
        await OfferLog.create({
            candidate: offer?.candidate,
            offer: offer?._id,
            action: 'updated',
            performedAt: Date.now(),
            performedBy: req.user._id,
            details: {
                status: offer?.status,
                salary: offer?.salary,
                joinedDate: offer?.startDate,
                responseDeadline: offer?.responseDeadline
            }
        })

        const candidateInfo = await Candidate.findById(offer?.candidate);
        await ActivityLog.create({
            candidate: offer?.candidate,
            userID: req.user._id,
            action: 'updated',
            entityType: 'offers',
            relatedId: offer?._id,
            metaData: {
                title: candidateInfo?.name,
                status: offer?.status,
                description: candidateInfo?.status
            }
        })
        return res.status(200).json({ success: true, message: "Offer updated successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const delteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        //offer logs
        await OfferLog.create({
            candidate: offer?.candidate,
            offer: offer?._id,
            action: 'deleted',
            performedAt: Date.now(),
            performedBy: req.user._id,
            details: {
                status: offer?.status,
                salary: offer?.salary,
                joinedDate: offer?.startDate,
                responseDeadline: offer?.responseDeadline
            }
        })
        const candidateInfo = await Candidate.findById(offer?.candidate);

        await ActivityLog.create({
            candidate: offer?.candidate,
            userID: req.user._id,
            action: 'deleted',
            entityType: 'offers',
            relatedId: offer?._id,
            metaData: {
                title: candidateInfo?.name,
                status: offer?.status,
                description: candidateInfo?.status
            }
        })

        const result = await updateCandidateCurrentStage(offer?.candidate, 'offer', 'deleted');
        if (!result?.success) {
            return res.status(500).json({ success: false, message: result?.message });
        }
        return res.status(200).json({ success: true, message: "Offer deleted successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getOfferLogsByCandidate = async (req, res) => {
    try {
        const offerLogs = await OfferLog.find({ candidate: req.params.id }).sort({ createdAt: -1 }).select(' -__v').populate({
            path: 'candidate',
            select: '-__v'
        }).populate({
            path: 'offer',
            select: '-__v'
        });
        if (offerLogs.length === 0) {
            return res.status(404).json({ success: false, message: "Offer logs not found" });
        }
        return res.status(200).json({ success: true, message: "Offer logs fetched successfully", data: offerLogs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { createOffer, getOffer, getOfferByCandidates, getOfferById, updateOffer, delteOffer, getOfferLogsByCandidate }

