export type globalResponse = {
    success: boolean;
    message: string;
}

export type user = {
    username: string;
    email: string;
    token: string;
}

export type userFormData = {
    username: string;
    email: string;
    password: string;
}

export type referenceData = {
    name: [string];
}

export type candidateFormData = {
    name: string;
    email: string;
    phone: string[];
    technology: string;
    level: string;
    experience: number;
    expectedsalary: number;
    reference: referenceData;
}


export type referenceResponse = {
    _id: string;
    name: referenceData;
}
export type candidateData = {
    name: string;
    email: string;
    phone: string[];
    technology: string;
    level: string;
    experience: number;
    expectedsalary: number;
    reference: referenceResponse;
    status: 'New' | 'Shortlisted' | 'Interview' | 'Assessment' | 'Hired' | 'Rejected' | 'Blacklisted';
    _id: string

}
export type candidateResponse = {
    success: boolean;
    message: string;
    data: candidateData[];
}

