import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout } from '../slices/authSlices';

const baseURL = import.meta.env.VITE_API_URL;

// Base query with token
const rawBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.user?.token;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Wrapper with response handling
const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    try {
        const result = await rawBaseQuery(args, api, extraOptions);

        // Handle 401 Unauthorized error
        if (result.error?.status === 401 || result.error?.status === 403) {
            api.dispatch(logout());
        }

        // Handle other errors (optional logging or custom handling)
        if (result.error) {
            console.error('API Error:', result.error);
        }

        return result;
    } catch (error: any) {
        const errorResponse: string = error.response;
        return {
            error: {
                status: error?.status || 500,
                data: error?.data || error?.message || 'Unknown error',
                error: errorResponse
            } as FetchBaseQueryError,
        };
    }
};

// API slice
export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['User', 'Candidate', 'Interview', 'Assessment', 'Assignment'],
    endpoints: () => ({}),
});