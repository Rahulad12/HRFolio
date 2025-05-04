import dayjs from "dayjs";
import sendEmail from "./sendEmail.js";
import logger from "./logger.js";

const fillTemplate = (template, variables) => {
    return Object.entries(variables).reduce((acc, [key, value]) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        return acc.replace(pattern, value ?? '');
    }, template);
};

export const sendInterviewerNotificationEmail = async (candidateInfo, interviewInfo, interviewerInfo) => {
    logger.info("Sending interviewer notification email");
    if (!interviewInfo) return { success: false, message: "Interview info not found." };
    if (!interviewInfo?.interviewer) return { success: false, message: "Interviewer id is missing." };
    if (!interviewerInfo?.email) return { success: false, message: "Interviewer email is missing." };

    const variables = {
        candidateName: candidateInfo.name,
        technology: candidateInfo.technology,
        interviewDate: dayjs(interviewInfo.date).format("MMMM D, YYYY"),
        interviewTime: dayjs(interviewInfo.time).format("h:mm A"),
        interviewerName: interviewerInfo?.name,
        interviewerEmail: interviewerInfo?.email,
        interviewType: interviewInfo.type,
        interviewLink: interviewInfo.meetingLink || "None",
        duration: interviewInfo.duration || 60,
        notes: interviewInfo.notes || "None",
        interviewRound: interviewInfo.InterviewRound || "unspecified",
    };
    logger.info("All input checks passed. Entering try block.");
    try {
        const interviewerBody = fillTemplate(`
            <b>Dear {{interviewerName}},</b>
            <br><br>
            <p>
            We have scheduled an interview for {{candidateName}} with you on {{interviewDate}} at {{interviewTime}}.
            This will be his/her {{interviewRound}} interview for the {{technology}} position.
            </p>
            <br><br>
            <p>
            <b>Interview Details:</b>
            <br>
            <b>Interview Type:</b> {{interviewType}}<br>
            <b>Meeting Link:</b> {{interviewLink}}<br>
            <b>Duration:</b> {{duration}} minutes<br>
            <b>Interview Date:</b> {{interviewDate}}<br>
            <b>Interview Time:</b> {{interviewTime}}<br><br>
            <b>Notes:</b> {{notes}}
            </p>
            <br><br>
            <p>
            <b>Best Regards</b><br>
            <i>Gokuldham Society</i>
            </p>
            `, variables);

        const emailSubject = fillTemplate("{{interviewerName}} has scheduled an interview for {{candidateName}}", variables);
        logger.info("Passed All Variables Checks");
        logger.debug("Email subject:", emailSubject);
        logger.debug("Email body:", interviewerBody);
        await sendEmail({
            to: interviewerInfo.email,
            subject: emailSubject,
            html: interviewerBody
        });
        logger.info("Email sent to interviewer");

        return { success: true };
    } catch (error) {
        console.log(error);
        logger.error("Error sending email to interviewer");
        return { success: false, message: "Cannot send email to interviewer" };
    }

}