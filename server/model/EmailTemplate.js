import mongoose from "mongoose";

const allowedVariables = [
    'candidateName',
    'position',
    'salary',
    'startDate',
    'interviewDate',
    'interviewTime',
    'assessmentDate',
    'assessmentTime',
    'rejectionReason',
    'rejectionDate',
    'rejectionTime',
    'offerDate',
    'offerTime',
    'duration',
    'technology',
    'benefits',
    'stockOptions',
    'responseDeadline'
];

const emailTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ["offer", "interview", "assessment", "rejection", "other"],
        required: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    variables: {
        type: [String],
        enum: allowedVariables,
        required: true
    }
}, {
    timestamps: true
});

emailTemplateSchema.pre('save', function (next) {
    const template = this;
    const variableRegex = /{{(.*?)}}/g;

    const foundVariables = [];
    let match;

    while ((match = variableRegex.exec(template.body)) !== null) {
        foundVariables.push(match[1]);
    }

    // Remove duplicates and validate against allowed enum
    const uniqueValidVariables = [...new Set(foundVariables)].filter(v => allowedVariables.includes(v));

    template.variables = uniqueValidVariables;

    next();
});

const EmailTemplate = mongoose.model("emailtemplates", emailTemplateSchema);
export default EmailTemplate;
