export type globalResponse = {
    success: boolean;
    message: string;
}

export type user = {
    username: string | null;
    email: string | null;
    token: string | null;
}

export type userFormData = {
    username: string;
    email: string;
    password: string;
}
