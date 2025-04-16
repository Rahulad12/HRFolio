import { api } from "./api";
import { assessmentFormData, assessmentResponse, AssignmentData, assignmentResponse } from "../types/index"
import { ASSESSMENT_URL } from "../constant";
export const assessmentServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createAssessment: builder.mutation<assessmentResponse, assessmentFormData>({
            query: (data) => ({
                url: `${ASSESSMENT_URL}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Assessment"]
        }),
        getAssessment: builder.query<assessmentResponse, void>({
            query: () => ({
                url: `${ASSESSMENT_URL}`,
                method: "GET",
            }),
            providesTags: ["Assessment"]
        }),
        createAssignAssessment: builder.mutation<assignmentResponse, AssignmentData>({
            query: (data) => ({
                url: `${ASSESSMENT_URL}/assign`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Assignment", "Assessment"]
        }),
        getAssignedAssessment: builder.query<assignmentResponse, void>({
            query: () => ({
                url: `${ASSESSMENT_URL}/assignment`,
                method: "GET",
            }),
            providesTags: ["Assignment", "Assessment"]
        }),
        deleteAssessment: builder.mutation<assessmentResponse, string>({
            query: (id) => ({
                url: `${ASSESSMENT_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Assessment"]
        }),
        deleteAssignment: builder.mutation<assignmentResponse, string>({
            query: (id) => ({
                url: `${ASSESSMENT_URL}/assignment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Assignment", "Assessment"]
        })
    }),
});

export const {
    useCreateAssessmentMutation,
    useGetAssessmentQuery,
    useCreateAssignAssessmentMutation,
    useGetAssignedAssessmentQuery,
    useDeleteAssessmentMutation,
    useDeleteAssignmentMutation
} = assessmentServiceApi;