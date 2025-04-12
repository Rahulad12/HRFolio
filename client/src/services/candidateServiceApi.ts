import { CANDIDATE_URL } from "../constant";
import { api } from "./api";
import { candidateResponse, candidateFormData, globalResponse } from "../types";

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
        getCandidate: builder.query<candidateResponse, void>({
            query: () => ({
                url: `${CANDIDATE_URL}`,
                method: "GET",
            }),
            providesTags: ["Candidate"],
        }),

        getCandidateById: builder.query<candidateResponse, string>({
            query: (id) => ({
                url: `${CANDIDATE_URL}/${id}`,
                method: "GET",
            }),
            providesTags: ["Candidate"],
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

export const { useCreateCandidateMutation, useGetCandidateQuery, useGetCandidateByIdQuery, useDeleteCandidateMutation } = candidateServiceApi;