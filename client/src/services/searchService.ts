import { candidateResponse } from "../types";
import { api } from "./api";

const searchServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSearchTerms: builder.query<candidateResponse, string>({
            query: (searchText) => ({
                url: '/search',
                method: 'GET',
                params: { searchText },
            }),
        }),
    }),
});

export const { useGetSearchTermsQuery } = searchServiceApi;
