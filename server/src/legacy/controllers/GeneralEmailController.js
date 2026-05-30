import GeneralEmail from "../model/GeneralEmail.js";
import ActivityLog from "../model/ActivityLogs.js";
import sendEmail from "../utils/sendEmail.js";
import Candidate from "../model/Candidate.js";
import { auditLogService } from "../../modules/audit-logs/index.js";

const createGeneralEmail = async (req, res) => {
  const { candidate: candidateId, emailAddress, subject, body, attachment } = req.body;
  try {
    const candidateDoc = await Candidate.findById(candidateId);
    if (!candidateDoc) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    // HR may only send to their own candidates (FRS §4.5)
    if (
      req.user.role === "HR" &&
      candidateDoc.createdBy?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only send mail to your own candidates",
      });
    }

    const generalEmail = await GeneralEmail.create({
      candidate: candidateId,
      emailAddress,
      subject,
      body,
      attachment,
    });

    await sendEmail({ to: emailAddress, subject, html: body });

    await auditLogService.log({
      actor: { id: req.user.id, name: req.user.name || "Unknown", role: req.user.role },
      action: "EMAIL_SENT",
      target: { id: candidateDoc._id, type: "candidates", name: candidateDoc.name },
      metadata: { after: { subject, emailAddress } },
    });

    await ActivityLog.create({
      candidate: candidateId,
      userID: req.user._id,
      action: "created",
      entityType: "generalEmails",
      relatedId: generalEmail._id,
      metaData: { title: candidateDoc.name },
    });

    return res.status(201).json({
      success: true,
      message: "General email created successfully",
      data: generalEmail,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createGeneralEmail };
