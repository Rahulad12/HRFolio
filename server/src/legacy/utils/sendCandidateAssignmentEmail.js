import dayjs from "dayjs";
import sendEmail from "./sendEmail.js";
import logger from "./logger.js";
const fillTemplate = (template, variables) => {
    return Object.entries(variables).reduce((acc, [key, value]) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        return acc.replace(pattern, value ?? '');
    }, template);
};

export const sendCandidateAssignmentEmail = async (candidateInfo, assessmentInfo, emailTemplate) => {
    logger.info("Sending candidate assignment email");
    if (!candidateInfo?.email) return { success: false, message: "Candidate email is missing." };
    if (!assessmentInfo) return { success: false, message: "Assessment info not found." };
    if (!emailTemplate) {
        return res.status(404).json({ success: false, message: 'Email template not found' });
    }

    const variables =
    {
        candidateName: candidateInfo.name,
        technology: assessmentInfo.technology,
        assessmentName: assessmentInfo.title,
        dueDate: dayjs(assessmentInfo.dueDate).format("MMMM D, YYYY"),
        assessmentLink: assessmentInfo.link,
        assessmentTime: dayjs(assessmentInfo.dueDate).format("hh:mm A"),
        assessmentType: assessmentInfo.type,
        duration: assessmentInfo.duration || 60,
        assessmentLevel: assessmentInfo.level,

    }

    logger.info("All input checks passed. Entering try block.");
    try {
        const subject = fillTemplate(emailTemplate.subject, variables);
        const body = fillTemplate(emailTemplate.body, variables);

        logger.info("All input checks passed. Entering try block.");
        await sendEmail({
            to: candidateInfo.email,
            subject,
            text: body
        });

        logger.info(`Assignment Email sent successfully to candidate.${candidateInfo.email}`);
        return { success: true, message: "Assignment email sent successfully" };
    } catch (error) {
        console.error("Error sending assignment email:", error);
        logger.error("Error sending assignment email:", error);
        return { success: false, message: `Error sending assignment email: ${error.message}` };
    }


}