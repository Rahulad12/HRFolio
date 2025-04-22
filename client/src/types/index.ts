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
export type candidateStatus = 'shortlisted' | 'first' | 'second' | 'third' | 'assessment' | 'offered' | 'hired' | 'rejected';
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
    type: 'phone' | 'video' | 'in-person';
    feedback: string;
    notes: string;
    status: 'scheduled' | 'cancelled' | 'completed';
    _id: string;
    __v: number;
}

export type interviewResponse = {
    success: boolean;
    message: string;
    data: interviewData;
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
export interface Assessment {
    id: string;
    title: string;
    description: string;
    type: 'technical' | 'behavioral' | 'case-study';
    duration: number; // in minutes
}

export interface Interview {
    id: string;
    candidateId: string;
    interviewerId: string;
    date: string;
    time: string;
    type: 'phone' | 'video' | 'onsite';
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
    rating?: number;
}

// Type definitions for the recruitment dashboard



export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    status: candidateStatus;
    resume: string;
    appliedDate: string;
    notes: string;
}

export interface Interview {
    id: string;
    candidateId: string;
    interviewerId: string;
    date: string;
    time: string;
    type: 'phone' | 'video' | 'onsite';
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
    rating?: number;
}

export interface Assessment {
    id: string;
    title: string;
    description: string;
    type: 'technical' | 'behavioral' | 'case-study';
    duration: number; // in minutes
}

export interface AssessmentAssignment {
    id: string;
    candidateId: string;
    assessmentId: string;
    assignedDate: string;
    dueDate: string;
    status: 'assigned' | 'completed' | 'evaluated';
    score?: number;
    feedback?: string;
}

export interface Interviewer {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    availability: Array<{
        day: string;
        timeSlots: string[];
    }>;
}

export interface OfferLetter {
    id: string;
    candidateId: string;
    position: string;
    salary: string;
    startDate: string;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'negotiating';
    sentDate?: string;
    responseDate?: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    type: 'offer' | 'interview' | 'assessment' | 'rejection' | 'other';
}

export interface MetricsData {
    openPositions: number;
    activeCandidates: number;
    interviewsScheduled: number;
    offersExtended: number;
    timeToHire: number;
}