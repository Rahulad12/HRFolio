import EmailTemplate from "../model/EmailTemplate.js";
import sendEmail from "./sendEmail.js";
import dayjs from "dayjs";

export const sendInterviewEmail = async (canidateInfo, interviewInfo, interviewerInfo, interviewRound) => {
    if (!interviewRound) {
        return { success: false, message: "Interview round not provided." };
    }

    if (!interviewInfo) return { success: false, message: "Interview info not found." };
    if (!canidateInfo?.email) return { success: false, message: "Candidate email is missing." };

    const emailTemplate = await EmailTemplate.findOne({ type: "interview" }).lean();
    if (!emailTemplate?.subject || !emailTemplate?.body) {
        return { success: false, message: "Email template is missing or incomplete." };
    }

    const body = emailTemplate.body
        .replace("{{candidateName}}", canidateInfo?.name)
        .replace("{{technology}}", canidateInfo?.technology)
        .replace("{{interviewDate}}", dayjs(interviewInfo.date).format("MMMM D, YYYY"))
        .replace("{{interviewTime}}", dayjs(interviewInfo.time).format("h:mm A"))
        .replace("{{interviewerName}}", interviewerInfo.name)
        .replace("{{interviewerEmail}}", interviewerInfo.email)
        .replace("{{interviewRound}}", interviewRound);

    await sendEmail({ to: canidateInfo.email, subject: emailTemplate.subject, html: body });

    return { success: true };
};
