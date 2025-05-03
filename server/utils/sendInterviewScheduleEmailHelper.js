import EmailTemplate from "../model/EmailTemplate.js";
import sendEmail from "./sendEmail.js";
import dayjs from "dayjs";

/**
 * Replace all variable placeholders in a template string with given values.
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

export const sendInterviewEmail = async (candidateInfo, interviewInfo, interviewerInfo, interviewRound) => {
    if (!interviewRound) return { success: false, message: "Interview round not provided." };
    if (!interviewInfo) return { success: false, message: "Interview info not found." };
    if (!candidateInfo?.email) return { success: false, message: "Candidate email is missing." };

    const emailTemplate = await EmailTemplate.findOne({ type: "interview" }).lean();
    if (!emailTemplate?.subject || !emailTemplate?.body) {
        return { success: false, message: "Email template is missing or incomplete." };
    }

    let emailBody;
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

    const emailSubject = fillTemplate(emailTemplate.subject, variables);

    // Interviewer-specific email body
    if (interviewerInfo?.email) {
        emailBody = fillTemplate(`
        <b>Dear {{interviewerName}},</b>
        <br><br>
        <p>
        We have scheduled an interview for {{candidateName}} with you on {{interviewDate}} at {{interviewTime}}.
        This will be their {{interviewRound}} interview for the {{technology}} position.
        </p>
        <br><br>
        <p>
        <b>Interview Details:</b>
        <br>
        <b>Meeting Link:</b> {{interviewLink}}
        <br>
        <b>Duration:</b> {{duration}} minutes
        <br>
        <b>Interview Date:</b> {{interviewDate}}
        <br>
        <b>Interview Time:</b> {{interviewTime}}
        <br><br>
        <b>Notes:</b> {{notes}}
        </p>

        <br><br>
        <p>
        <b>Best Regards</b>
        <br>
        <i>Gokuldham Society</i>
        </p>
        `, variables);
    } else {
        emailBody = fillTemplate(emailTemplate.body, variables);
    }

    const recipients = [candidateInfo.email];
    if (interviewerInfo?.email) recipients.push(interviewerInfo.email);

    try {
        await Promise.all(
            recipients.map(email =>
                sendEmail({ to: email, subject: emailSubject, html: emailBody }).catch(err => {
                    console.error(`Error sending email to ${email}:`, err);
                })
            )
        );
        return { success: true };
    } catch (err) {
        console.error("Error sending interview email:", err);
        return { success: false, message: "Error sending email." };
    }
};
