import GeneralEmail from "../model/GeneralEmail.js";
import ActivityLog from "../model/ActivityLogs.js";
import sendEmail from "../utils/sendEmail.js";
import Candidate from "../model/Candidate.js";


const createGeneralEmail = async (req, res) => {
    const { candidate, emailAddress, subject, body, attachment } = req.body;
    try {
        const generalEmail = await GeneralEmail.create({
            candidate,
            emailAddress,
            subject,
            body,
            attachment
        });
        if (!generalEmail) {
            return res.status(400).json({ message: "General email not created" });
        }

        await sendEmail({
            to: emailAddress,
            subject,
            html: body,
        })

        const candidateInfo = await Candidate.findById(candidate);


        await ActivityLog.create({
            candidate: generalEmail.candidate,
            userID: req.user._id,
            action: 'created',
            entityType: 'generalEmails',
            relatedId: generalEmail._id,
            metaData: {
                title: candidateInfo?.name,
            }
        })


        return res.status(201).json({
            success: true,
            message: "General email created successfully",
            data: generalEmail
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export { createGeneralEmail }