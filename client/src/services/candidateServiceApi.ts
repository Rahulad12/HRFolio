import { CANDIDATE_URL } from "../constant";
import { api } from "./api";
import { candidateResponse, candidateFormData, globalResponse, candidateData, candidateFilter } from "../types";

interface candidateIdResposne {
    success: boolean,
    message: string
    data: candidateData
}


export const candidateServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCandidate: builder.mutation<globalResponse, candidateFormData>({
            query: (data: candidateFormData) => ({
                url: `${CANDIDATE_URL}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Candidate"],
        }),
        getCandidate: builder.query<candidateResponse, candidateFilter>({
            query: (filters) => ({
                url: `${CANDIDATE_URL}`,
                method: "GET",
                params: {
                    searchText: filters.searchText,
                    status: filters.status,
                },
            }),
            providesTags: ["Candidate"],

        }),

        getCandidateById: builder.query<candidateIdResposne, string | undefined>({
            query: (id) => ({
                url: `${CANDIDATE_URL}/${id}`,
                method: "GET",
            }),
            providesTags: ["Candidate"],
        }),
        updateCandidate: builder.mutation<candidateIdResposne, { id: string | null, data: candidateFormData }>({
            query: ({ id, data }) => ({
                url: `${CANDIDATE_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Candidate"],
        }),
        deleteCandidate: builder.mutation<globalResponse, string>({
            query: (id) => ({
                url: `${CANDIDATE_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Candidate"],
        }),

    }),
});

export const { useCreateCandidateMutation, useGetCandidateQuery, useGetCandidateByIdQuery, useDeleteCandidateMutation, useUpdateCandidateMutation } = candidateServiceApi;