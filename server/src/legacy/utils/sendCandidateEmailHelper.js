import dayjs from "dayjs";
import EmailTemplate from "../model/EmailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import { makeCapitilized } from "./makeCapitilize.js";
import { updateCandidateCurrentStage } from "./updateCandidateProgress.js";

/**
 * Replace template placeholders with dynamic values.
 * @param {string} template - The email template with placeholders.
 * @param {Object} variables - Object containing values to replace placeholders with.
 * @returns {string} - Template with placeholders replaced.
 */
const fillTemplate = (template, variables) => {
    return Object.entries(variables).reduce((updatedTemplate, [key, value]) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        return updatedTemplate.replace(pattern, value ?? '');
    }, template);
};

/**
 * Send an email to a candidate based on the specified email type.
 * @param {string} type - The type of email (e.g., "hired", "rejection").
 * @param {Object} candidate - Candidate details (name, email, technology).
 * @param {Object} offer - Offer details (position, startDate).
 * @returns {Promise<Object>} - Result indicating success or failure.
 */
export const sendCandidateEmail = async (type, candidate, offer) => {
    try {
        const template = await EmailTemplate.findOne({ type }).lean();
        if (!template) return { success: false, message: `Email template for '${type}' not found.` };

        const variables = {
            candidateName: makeCapitilized(candidate?.name) || candidate?.name,
            position: offer?.position,
            technology: candidate?.technology,
        };

        let body = fillTemplate(template.body, variables);
        const subject = fillTemplate(template.subject, variables);

        // Add dynamic data for specific email types
        if (type === "rejection") {
            body = fillTemplate(body, {
                rejectionDate: dayjs().format("MMMM D, YYYY"),
                rejectionTime: dayjs().format("h:mm A"),
            });
        } else if (type === "hired") {
            body = fillTemplate(body, { startDate: offer?.startDate });
            await updateCandidateCurrentStage(candidate?._id, "hired", "updated");
        }

        await sendEmail({ to: candidate?.email, subject, html: body });
        return { success: true };
    } catch (err) {
        console.error("Error sending candidate email:", err);
        return { success: false, message: "Internal error occurred." };
    }
};
