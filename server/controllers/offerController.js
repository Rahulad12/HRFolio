import Candidate from "../model/Candidate.js";
import EmailTemplate from "../model/EmailTemplate.js";
import Offer from "../model/Offer.js";
import sendEmail from "../utils/sendEmail.js";

const createOffer = async (req, res) => {
    const { candidate, email, position, salary, startDate, responseDeadline, status } = req.body;

    try {
        const existingOffer = await Offer.findOne({ candidate });

        if (existingOffer && existingOffer.status === 'sent') {
            return res.status(400).json({
                success: false,
                message: 'Offer has already been sent to this candidate.',
            });
        }

        if (existingOffer && existingOffer.status === 'draft') {
            await Offer.findByIdAndDelete(existingOffer._id);
        }

        const newOffer = await Offer.create({
            candidate,
            email,
            position,
            salary,
            startDate,
            responseDeadline,
            status,
        });

        if (newOffer.status === 'sent') {
            const candidateInfo = await Candidate.findById(candidate);
            const emailTemplate = await EmailTemplate.findById(email);

            if (candidateInfo && emailTemplate) {
                const html = emailTemplate.body
                    .replace(/{{candidateName}}/g, candidateInfo.name)
                    .replace(/{{position}}/g, position)
                    .replace(/{{salary}}/g, salary)
                    .replace(/{{startDate}}/g, startDate)
                    .replace(/{{responseDeadline}}/g, responseDeadline);

                const subject = emailTemplate.subject.replace(/{{position}}/g, position);

                await sendEmail({
                    to: candidateInfo.email,
                    subject: subject,
                    html,
                });
            }
        }

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
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer updated successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { createOffer, getOffer, getOfferByCandidates, getOfferById, updateOffer }

