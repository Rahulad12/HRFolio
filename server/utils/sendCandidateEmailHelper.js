import dayjs from "dayjs";
import EmailTemplate from "../model/EmailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import { makeCapitilized } from "./makeCapitilize.js";

/**
 * Sends an email to a candidate based on the specified type and offer details.
 * Fetches the corresponding email template, replaces placeholders with candidate and offer details,
 * and sends the email using the candidate's email address.
 *
 * @param {string} type - The type of email to send (e.g., "hired", "rejection").
 * @param {Object} candidate - The candidate object containing the candidate's details.
 * @param {Object} candidate.name - The name of the candidate.
 * @param {Object} candidate.email - The email address of the candidate.
 * @param {Object} offer - The offer object containing the offer details.
 * @param {string} offer.position - The position offered to the candidate.
 * @param {string} [offer.startDate] - The start date for the hired candidate, required if type is "hired".
 * @returns {Promise<Object>} - A promise that resolves to an object indicating the success or failure of the email operation.
 * If the template or offer is not found, the promise resolves to an object with a success flag set to false and an error message.
 */

export const sendCandidateEmail = async (type, candidate, offer) => {
    console.log("come in send Email");
    try {
        const template = await EmailTemplate.findOne({ type }).lean();
        if (!template) return { success: false, message: `Email template for '${type}' not found.` };

        let body = template.body
            .replace("{{candidateName}}", makeCapitilized(candidate?.name) || candidate?.name)
            .replace("{{position}}", offer?.position)
            .replace("{{technology}}", candidate?.technology);


        const subject = template.subject.replace("{{position}}", makeCapitilized(offer?.position) || offer?.position).replace("{{technology}}", makeCapitilized(offer?.technology) || candidate?.technology);

        if (type === "rejection") {
            body = body
                .replace("{{rejectionDate}}", dayjs().format("MMMM D, YYYY"))
                .replace("{{rejectionTime}}", dayjs().format("h:mm A"));
        } else if (type === "hired") {
            body = body.replace("{{startDate}}", offer?.startDate);
        }

        await sendEmail({ to: candidate?.email, subject: subject, html: body });
        return { success: true };
    } catch (err) {
        console.error("Error sending candidate email:", err);
        return { success: false, message: "Internal error occurred." };
    }
};
