import type { Dayjs } from 'dayjs';
import { Key } from 'react';
export type globalResponse = {
    success: boolean;
    message: string;
}

export type user = {
    username: string;
    email: string;
    token: string;
    picture: string | null;
    loggedIn: boolean;
    Id: string;
}

export type userFormData = {
    username: string;
    email: string;
    password: string;
}

export type referenceData = {
    name: string,
    contact: string,
    relation: string
}

export type candidateFormData = {
    name: string;
    email: string;
    phone: number;
    technology: string;
    level: string;
    experience: number;
    expectedsalary: number;
    references: referenceData[];
    applieddate: string | null;
    resume: string | null;
    status: candidateStatus
}

export type candidateFilter = {
    searchText: string;
    status: string;
}

export type referenceResponse = {
    _id: string;
    name: string;
    contact: string;
    relation: string

}
export type candidateStatus = 'shortlisted' | 'first' | 'second' | 'third' | 'assessment' | 'offered' | 'hired' | 'rejected';
export type interviewStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled' | 'failed';
export type candidateData = {
    name: string;
    email: string;
    phone: number;
    technology: string;
    level: string;
    experience: number;
    expectedsalary: number;
    references: referenceResponse[];
    status: candidateStatus;
    _id: string;
    createdAt: string;
    applieddate: string;
    resume: string;
    updatedAt: string
}
export type candidateResponse = {
    success: boolean;
    message: string;
    data: candidateData[];
}
export type interviewer = {
    _id: string;
    name: string;
    email: string;
    department: string;
    position: string
    createdAt: string;
    updatedAt: string
}
export type interviewData = {
    candidate: candidateData;
    interviewer: interviewer;
    date: Dayjs;
    time: Dayjs;
    type: 'phone' | 'video' | 'in-person';
    feedback: string;
    rating: number;
    notes: string;
    status: interviewStatus;
    InterviewRound: 'first' | 'second' | 'third';
    _id: string;
    __v: number;
    createdAt: string;
    updatedAt: string
}

export type interviewResponse = {
    success: boolean;
    message: string;
    data: interviewData[];
}
export type interviewResponseById = {
    success: boolean;
    message: string;
    data: interviewData[];
}

// export type interviewerResponse = {
//     success?: boolean;
//     message?: string;
//     data?: interviewer[]
// }

//assessmet types
export type assessmentFormData = {
    title: string;
    type: "behavioural" | "technical";
    technology: string,
    level: string;
    assessmentLink: string;
    duration: number
}

export type AssessmentDataResponse = {
    title: string;
    type: "behavioural" | "technical";
    technology: string,
    level: string;
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
    duration: number
    assessmentLink: string
}

export type assessmentResponse = {
    success: boolean;
    message: string;
    data: AssessmentDataResponse[];
}
export type assessmentResponseById = {
    success: boolean;
    message: string;
    data: AssessmentDataResponse
}
export type AssignmentData = {
    candidate: string[] | Key[];
    assessment: string;
    dueDate: string;
    status: 'Assigned' | 'pending' | 'completed';
    emailTemplate: string;
}

export type AssignmentDataResponse = {
    candidate: candidateData;
    assessment: {
        _id: string;
        title: string;
        type: "behavioural" | "technical";
        technology: string,
        level: string
        assessmentLink: string;
        duration: number
        createdAt: string;
        updatedAt: string
    }
    date: Dayjs;
    status: 'Assigned' | 'pending' | 'completed';
    _id: string;
    __v: number;
    emailTemplate: string;
    createdAt: string;
    updatedAt: string
    score: number
}

export type assignmentResponse = {
    success: boolean;
    message: string;
    data: AssignmentDataResponse[];
}

export type assignmentResponseById = {
    success: boolean;
    message: string;
    data: AssignmentDataResponse;
}

export type AssignmentScoreFromData = {
    candidate: string;
    assessment: string;
    score: number;
    status: string;
    note: string;
}
export type AssignmentScoreResponse = {
    candidate: candidateData;
    assessment: assessmentFormData;
    score: number;
    status: string;
    note: string;
    _id: string;
    createdAt: string;
    updatedAt: string
}
export type AssgnmentScoreResponse = {
    success: boolean;
    message: string;
    data: AssignmentScoreResponse[];
}

export type UploadFileResponse = {
    success: boolean;
    message: string;
    url: string;
}

export type UploadFileRequest = {
    file: File;
}

export type interviewerData = {
    _id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    createdAt: string;
    updatedAt: string
}

export type interviewerResponse = {
    success: boolean;
    message: string;
    data: interviewerData[];
}
export type interviewerResponseId = {
    success: boolean;
    message: string;
    data: interviewerData;
}

export type allowedVariables = [
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
export type emailTemplateData = {
    _id: string;
    name: string;
    subject: string;
    body: string;
    type: 'offer' | 'interview' | 'assessment' | 'rejection' | 'other'
    createdAt: string;
    updatedAt: string;
    variables: allowedVariables
    __v: number
}

export type emailTemplateResponse = {
    success: boolean;
    message: string;
    data: emailTemplateData[]
}
export type emailTemplateResponseById = {
    success: boolean;
    message: string;
    data: emailTemplateData;
}

export type offerLetter = {
    _id: string;
    candidate: candidateData;
    email: string;
    position: string;
    salary: string;
    startDate: string;
    responseDeadline: string;
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export type offerLetterResponse = {
    success: boolean;
    message: string;
    data: offerLetter[]
}

export type offerLetterResponseById = {
    success: boolean;
    message: string;
    data: offerLetter
}

export type offerLetterPostData = {
    candidate: string
    email: string
    position: string
    salary: string
    startDate: string
    responseDeadline: string
    status: 'draft' | 'sent' | 'accepted' | 'rejected'
}


//logs
export type interviewLogData = {
    _id: string;
    interviewId: interviewData
    candidate: candidateData;
    interviewer: interviewerData;
    action: string;
    details: {
        date: Dayjs;
        time: Dayjs;
        type: 'phone' | 'video' | 'in-person';
        note: string;
        status: interviewStatus;
        rating: number;
        feedback: string;
    }
    createdAt: string;
    updatedAt: string;
    performedBy: string;
    performedAt: string;
}

export type interviewLogResponse = {
    success: boolean;
    message: string;
    data: interviewLogData[];
}

export type interviewLogResponseById = {
    success: boolean;
    message: string;
    data: interviewLogData[];
}

export type activityLog = {
    _id: string;
    candidate: candidateData;
    userID: string;
    action: string;
    entityType: string;
    relatedId: string;
    metaData: {
        title: string
        interviewer: interviewerData;
        assessment: assessmentFormData;
        assignment: AssignmentDataResponse;
        feedback: string;
        rating: number;
        status: string;
    }
    createdAt: string;
    updatedAt: string
}
export type activityLogResponse = {
    success: boolean;
    data: activityLog[];
}
export type AssessmentLogData = {
    _id: string;
    assessment: AssessmentDataResponse;
    candidate: candidateData;
    action: string;
    details: {
        dueDate: Dayjs;
        status: interviewStatus;
        score: number;
        feedback: string;
    }
    createdAt: string;
    updatedAt: string;
    performedBy: string;
    performedAt: string;
}

export type AssessmentLogResponse = {
    success: boolean;
    message: string;
    data: AssessmentLogData[];
}

export type candidateLog = {
    _id: string;
    candidate: candidateData;
    action: string;
    createdAt: string;
    updatedAt: string;
    performedAt: string;
}

export type candidateLogResponse = {
    success: boolean;
    message: string;
    data: candidateLog[];
}

export type offerLog = {
    _id: string;
    candidate: candidateData;
    offer: offerLetter;
    action: string;
    details: {
        status: 'draft' | 'sent' | 'accepted' | 'rejected';
        salary: string;
        joinedDate: string;
        responseDeadline: string;
    }
    createdAt: string;
    updatedAt: string;
    performedAt: string;
}

export type offerLogResponse = {
    success: boolean;
    message: string;
    data: offerLog[];
}

export type generalEmailFormData = {
    emailAddress: string | undefined;
    candidate: string | undefined;
    subject: string;
    body: string;
    attachment: string;
}

export type generalEmailResponse = {
    success: boolean;
    message: string;
    data: generalEmailFormData[]
}