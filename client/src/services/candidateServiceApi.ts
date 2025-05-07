import { CANDIDATE_URL } from "../constant";
import { api } from "./api";
import { candidateResponse, candidateFormData, globalResponse, candidateData, candidateFilter, candidateLogResponse } from "../types";
import { Key } from "react";

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
        changeCandidateStage: builder.mutation<candidateIdResposne, {
            id: string | null, data: {
                status: string
            }
        }>({
            query: ({ id, data }) => ({
                url: `${CANDIDATE_URL}/stage/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Candidate"],
        }),
        deleteCandidate: builder.mutation<globalResponse, { id: string | Key[] }>({
            query: (id) => ({
                url: `${CANDIDATE_URL}`,
                method: "DELETE",
                body: id,
            }),
            invalidatesTags: ["Candidate", "Assessment", "Assignment", "OfferLetter", "Interview", "InterviewLog", "ActivityLog", "Score", , "EmailTemplate"],
        }),
        getCandidateLogsByCandidateId: builder.query<candidateLogResponse, string>({
            query: (id) => ({
                url: `${CANDIDATE_URL}/logs/${id}`,
                method: "GET",
            }),
            providesTags: ["Candidate"],
        }),
        rejectCandidate: builder.mutation<globalResponse, string>({
            query: (id) => ({
                url: `${CANDIDATE_URL}/reject/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Candidate"],
        }),

    }),
});

export const { useCreateCandidateMutation,
    useGetCandidateQuery,
    useGetCandidateByIdQuery,
    useDeleteCandidateMutation,
    useUpdateCandidateMutation,
    useGetCandidateLogsByCandidateIdQuery,
    useChangeCandidateStageMutation,
    useRejectCandidateMutation
} = candidateServiceApi;