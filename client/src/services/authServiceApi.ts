import { api } from "./api";
import { AUTH_URL } from "../constant";
import { globalResponse } from "../types";


interface AuthResponse {
    user: {
        username: string;
        email: string;
        token: string;
    };
    success: boolean;
    message: string;
}

export const authServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        googleLogin: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: `${AUTH_URL}/google`,
                method: "POST",
            }
            ),
        }),
        deleteUser: builder.mutation<globalResponse, string>({
            query: (id) => ({
                url: `${AUTH_URL}/${id}`,
                method: "DELETE"
            })
        }),
    })
})

export const { useGoogleLoginMutation, useDeleteUserMutation } = authServiceApi