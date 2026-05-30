import EmailTemplate from "../model/EmailTemplate.js";
import sendEmail from "./sendEmail.js";
import dayjs from "dayjs";

/**
 * @param {string} template 
 * @param {object} variables 
 * @returns {string}
 */
const fillTemplate = (template, variables) => {
    return Object.entries(variables).reduce((acc, [key, value]) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        return acc.replace(pattern, value ?? '');
    }, template);
};

export const sendCandidateInterviewEmail = async (candidateInfo, interviewInfo, interviewerInfo, interviewRound) => {
    if (!interviewRound) return { success: false, message: "Interview round not provided." };
    if (!interviewInfo) return { success: false, message: "Interview info not found." };
    if (!candidateInfo?.email) return { success: false, message: "Candidate email is missing." };

    const emailTemplate = await EmailTemplate.findOne({ type: "interview" }).lean();
    if (!emailTemplate?.subject || !emailTemplate?.body) {
        return { success: false, message: "Email template is missing or incomplete." };
    }

    const variables = {
        candidateName: candidateInfo.name,
        technology: candidateInfo.technology,
        interviewDate: dayjs(interviewInfo.date).format("MMMM D, YYYY"),
        interviewTime: dayjs(interviewInfo.time).format("h:mm A"),
        interviewerName: interviewerInfo?.name,
        interviewerEmail: interviewerInfo?.email,
        interviewRound,
        interviewType: interviewInfo.type,
        interviewLink: interviewInfo.meetingLink,
        duration: interviewInfo.duration || 60,
        notes: interviewInfo.notes || "None",
    };


    try {

        const candidateBody = fillTemplate(emailTemplate.body, variables);
        const emailSubject = fillTemplate(emailTemplate.subject, variables);

        await sendEmail({
            to: candidateInfo.email,
            subject: emailSubject,
            html: candidateBody,
        })

        return { success: true };
    } catch (err) {
        console.error("Error sending interview email:", err);
        return { success: false, message: `Cannot send email to candidate ${candidateInfo.email}` };
    }
};
