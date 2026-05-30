import EmailTemplate from "../model/EmailTemplate.js";


const createEmailTemplate = async (req, res) => {
    const { name, type, subject, body } = req.body;
    try {
        const emailTemplate = await EmailTemplate.create({ name, type, subject, body });
        if (!emailTemplate) {
            return res.status(400).json({ success: false, message: "Email template not created" });
        }
        res.status(201).json({
            success: true,
            message: "Email template created successfully",
            data: emailTemplate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getAllEmailTemplates = async (req, res) => {
    try {
        const emailTemplates = await EmailTemplate.find();
        if (!emailTemplates || emailTemplates.length === 0) {
            return res.status(404).json({ success: false, message: "No email templates found" });
        }
        res.status(200).json({ success: true, message: "Email templates fetched successfully", data: emailTemplates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSingleEmailTemplate = async (req, res) => {
    try {
        const emailTemplate = await EmailTemplate.findById(req.params.id);
        if (!emailTemplate) {
            return res.status(404).json({ success: false, message: "Email template not found" });
        }
        res.status(200).json({ success: true, message: "Email template fetched successfully", data: emailTemplate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateEmailTemplate = async (req, res) => {
    try {
        const emailTemplate = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!emailTemplate) {
            return res.status(404).json({ success: false, message: "Email template not found" });
        }
        res.status(200).json({ success: true, message: "Email template updated successfully", data: emailTemplate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteEmailTemplate = async (req, res) => {
    try {
        const emailTemplate = await EmailTemplate.findByIdAndDelete(req.params.id);
        if (!emailTemplate) {
            return res.status(404).json({ success: false, message: "Email template not found" });
        }
        res.status(200).json({ success: true, message: "Email template deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export { createEmailTemplate, getAllEmailTemplates, getSingleEmailTemplate, updateEmailTemplate, deleteEmailTemplate };