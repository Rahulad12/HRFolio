import { api } from "./api";
import { interviewData, interviewResponse, interviewResponseById, interviewerData, interviewerResponse, interviewerResponseId, interviewLogResponse, interviewLogResponseById } from "../types";
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

        getInterview: builder.query<interviewResponse, { date: Dayjs | null | string, status: string | null }>({
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
            providesTags: ["Interviewer"],
        }),
        createInterviewer: builder.mutation<interviewerResponse, interviewerData>({
            query: (data) => ({
                url: `${INTERVIEWER_URL}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Interviewer"],
        }),
        getInterviewerById: builder.query<interviewerResponseId, string>({
            query: (id) => ({
                url: `${INTERVIEWER_URL}/${id}`,
                method: "GET",
            }),
            providesTags: ["Interviewer"],
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
            invalidatesTags: ["Interview", "Candidate"],
        }),

        updateInterviewer: builder.mutation<interviewerResponse, { id: string, data: interviewerData }>({
            query: ({
                id,
                data
            }) => ({
                url: `${INTERVIEWER_URL}/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Interviewer", "Interview"],
        }),
        deleteInterviewer: builder.mutation<interviewerResponse, string>({
            query: (id) => ({
                url: `${INTERVIEWER_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Interviewer"],
        }),
        deleteInterview: builder.mutation<interviewResponse, string>({
            query: (id) => ({
                url: `${INTERVIEW_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Interview"],
        }),
        getinterviewLog: builder.query<interviewLogResponse, void>({
            query: () => ({
                url: `${INTERVIEW_URL}/log`,
                method: "GET",
            }),
            providesTags: ["InterviewLog", "Interview"],
        }),

        getInterviewLogByCanidateId: builder.query<interviewLogResponseById, string>({
            query: (id) => ({
                url: `${INTERVIEW_URL}/log/candidate/${id}`,
                method: "GET",
            }),
            providesTags: ["InterviewLog", "Interview", "Candidate", "Assessment", "OfferLetter"],
        })
    })
})

export const { useCreateInterviewMutation, useGetInterviewQuery, useGetInterviewByIdQuery, useGetInterviewerQuery, useUpdateInterviewMutation, useGetInterviewByCandidateIdQuery, useCreateInterviewerMutation, useGetInterviewerByIdQuery, useUpdateInterviewerMutation, useDeleteInterviewerMutation, useDeleteInterviewMutation, useGetinterviewLogQuery,
    useGetInterviewLogByCanidateIdQuery } = interviewServiceApi