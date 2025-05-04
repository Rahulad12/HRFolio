import { api } from "./api";
import { offerLetterResponse, offerLetterResponseById, offerLetterPostData, offerLogResponse } from "../types";
import { OFFER_URL } from "../constant";

export const offerServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({

        createOfferLetter: builder.mutation<offerLetterResponse, offerLetterPostData>({
            query: (data) => ({
                url: `${OFFER_URL}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["OfferLetter", "Candidate"]
        }),
        getOfferLetter: builder.query<offerLetterResponse, void>({
            query: () => ({
                url: `${OFFER_URL}`,
                method: "GET"
            }),
            providesTags: ["OfferLetter"]
        }),
        getOfferById: builder.query<offerLetterResponseById, string>({
            query: (id) => ({
                url: `${OFFER_URL}/${id}`,
                method: "GET"
            }),
            providesTags: ["OfferLetter"]
        }),
        getOfferLetterByCandidatesId: builder.query<offerLetterResponseById, string>({
            query: (id) => ({
                url: `${OFFER_URL}/candidate/${id}`,
                method: "GET"
            }),
            providesTags: ["OfferLetter"]
        }),
        updateOfferLetter: builder.mutation<offerLetterResponseById, { id: string, data: offerLetterPostData }>({
            query: ({ id, data }) => ({
                url: `${OFFER_URL}/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["OfferLetter", 'Candidate']
        }),
        deleteOfferLetter: builder.mutation<offerLetterResponseById, string>({
            query: (id) => ({
                url: `${OFFER_URL}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["OfferLetter"]
        }),

        getOfferLogsByCandidateId: builder.query<offerLogResponse, string>({
            query: (id) => ({
                url: `${OFFER_URL}/log/candidate/${id}`,
                method: "GET"
            }),
            providesTags: ["OfferLetter"]
        })

    })
})

export const { useCreateOfferLetterMutation, useGetOfferLetterQuery, useGetOfferByIdQuery, useGetOfferLetterByCandidatesIdQuery, useUpdateOfferLetterMutation,
    useGetOfferLogsByCandidateIdQuery, useDeleteOfferLetterMutation
} = offerServiceApi