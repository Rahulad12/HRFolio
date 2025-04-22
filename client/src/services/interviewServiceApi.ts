import { api } from "./api";
import { interviewData, interviewResponse, interviewResponseById, interviewerResponse } from "../types";
import { INTERVIEW_URL, INTERVIEWER_URL } from "../constant";
import type { Dayjs } from "dayjs";

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

        getInterview: builder.query<interviewResponse, { date: Dayjs | null | string, status: string }>({
            query: ({
                date,
                status
            }) => ({
                url: `${INTERVIEW_URL}`,
                method: "GET",
                params: {
                    date,
                    status
                }
            }),
            providesTags: ["Interview", "Candidate"],
        }),
        getInterviewById: builder.query<interviewResponseById, string | undefined>({
            query: (id) => ({
                url: `${INTERVIEW_URL}/${id}`,
                method: "GET",
            }),
            providesTags: ["Interview"],
        }),
        getInterviewByCandidateId: builder.query<interviewResponseById, string | undefined>({
            query: (id) => ({
                url: `${INTERVIEW_URL}/candidate/${id}`,
                method: "GET",
            }),
            providesTags: ["Interview"],
        }),

        getInterviewer: builder.query<interviewerResponse, void>({
            query: () => ({
                url: `${INTERVIEWER_URL}`,
                method: "GET",
            }),
        }),
        updateInterview: builder.mutation<interviewResponse, { id: string, data: interviewData }>({
            query: ({
                id,
                data
            }) => ({
                url: `${INTERVIEW_URL}/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Interview"],
        })
    })
})

export const { useCreateInterviewMutation, useGetInterviewQuery, useGetInterviewByIdQuery, useGetInterviewerQuery, useUpdateInterviewMutation, useGetInterviewByCandidateIdQuery } = interviewServiceApi