import { api } from "./api";
import { offerLetter, offerLetterResponse, offerLetterResponseById, offerLetterPostData } from "../types";
import { OFFER_URL } from "../constant";

export const offerServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({

        createOfferLetter: builder.mutation<offerLetterResponse, offerLetter>({
            query: (data) => ({
                url: `${OFFER_URL}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["OfferLetter"]
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
            invalidatesTags: ["OfferLetter"]
        }),

    })
})

export const { useCreateOfferLetterMutation, useGetOfferLetterQuery, useGetOfferByIdQuery, useGetOfferLetterByCandidatesIdQuery, useUpdateOfferLetterMutation } = offerServiceApi