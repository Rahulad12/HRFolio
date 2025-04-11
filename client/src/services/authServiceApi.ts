import { api } from "./api";
import { AUTH_URL } from "../constant";


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
            )
        })
    })
})

export const { useGoogleLoginMutation } = authServiceApi