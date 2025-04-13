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
    name: string;
    technology: string;
    status: string;
    level: string;
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

}
export type candidateResponse = {
    success: boolean;
    message: string;
    data: candidateData[];
}

