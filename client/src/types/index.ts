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
    reference: referenceData;
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
export type candidateData = {
    name: string;
    email: string;
    phone: number;
    technology: string;
    level: string;
    experience: number;
    expectedsalary: number;
    references: referenceResponse[];
    status: 'shortlisted' | 'first interview' | 'second interview' | 'hired' | 'rejected';
    _id: string
    createdAt: string
}
export type candidateResponse = {
    success: boolean;
    message: string;
    data: candidateData[];
}
export type interviewer = {
    _id: string;
    name: string;
    email: string
}
export type interviewData = {
    candidate: candidateData;
    interviewer: interviewer;
    date: Dayjs;
    time: string;
    status: 'scheduled' | 'cancelled' | 'completed';
    _id: string;
    __v: number;
}

export type interviewResponse = {
    success: boolean;
    message: string;
    data: interviewData[];
}
export type interviewResponseById = {
    success: boolean;
    message: string;
    data: interviewData;
}

export type interviewerResponse = {
    success?: boolean;
    message?: string;
    data?: interviewer[]
}

//assessmet types
export type assessmentFormData = {
    title: string;
    type: "behavioural" | "technical";
    technology: string,
    level: string;
    file: File;
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
    date: Dayjs;
}

export type AssignmentDataResponse = {
    candidate: candidateData;
    assessment: {
        _id: string;
        title: string;
        type: "behavioural" | "technical";
        technology: string,
        level: string
    }
    date: Dayjs;
    status: 'Assigned' | 'pending' | 'completed';
    _id: string;
    __v: number;
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