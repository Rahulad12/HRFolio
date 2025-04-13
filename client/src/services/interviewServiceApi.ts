import { api } from "./api";
import { interviewData, interviewResponse } from "../types";
import { INTERVIEW_URL } from "../constant";

export const interviewServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({

        createInterview: builder.mutation<interviewResponse, interviewData>({
            query: (data: interviewData) => ({
                url: `${INTERVIEW_URL}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Interview"],
        }),

        getInterview: builder.query<interviewResponse, void>({
            query: () => ({
                url: `${INTERVIEW_URL}`,
                method: "GET"
            }),
            providesTags: ["Interview"]
        }),
    })
})

export const { useCreateInterviewMutation, useGetInterviewQuery } = interviewServiceApi