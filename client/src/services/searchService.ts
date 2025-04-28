import { candidateData } from "../types";
import { api } from "./api";


const searchServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSearchTerms: builder.query<candidateData[], string>({
            query: (data: string) => ({
                url: '/search',
                method: "GET",
                params: {
                    searchText: data
                }
            }),
        }),
    })
})

export const { useGetSearchTermsQuery } = searchServiceApi;

