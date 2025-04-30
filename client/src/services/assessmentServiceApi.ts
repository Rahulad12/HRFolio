import { api } from "./api";
import { assessmentFormData, assessmentResponse, assessmentResponseById, AssgnmentScoreResponse, AssignmentData, assignmentResponse, assignmentResponseById, AssignmentScoreFromData, AssessmentLogResponse } from "../types/index"
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
        getAssignmentByCandidate: builder.query<assignmentResponse, string>({
            query: (id) => ({
                url: `${ASSESSMENT_URL}/assignment/candidate/${id}`,
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
        }),
        updateAssessment: builder.mutation<assessmentResponse, { data: assessmentFormData, id: string }>({
            query: ({ data, id }) => ({
                url: `${ASSESSMENT_URL}/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Assessment"]
        }),
        updateAssignmnet: builder.mutation<assignmentResponse, { data: AssignmentData, id: string }>({
            query: ({ data, id }) => ({
                url: `${ASSESSMENT_URL}/assignment/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Assignment", "Assessment"]
        }),
        getAssessmentById: builder.query<assessmentResponseById, string | undefined>({
            query: (id) => ({
                url: `${ASSESSMENT_URL}/${id}`,
                method: "GET",
            }),
            providesTags: ["Assessment"]
        }),
        getAssignmentById: builder.query<assignmentResponseById, string | undefined>({
            query: (id) => ({
                url: `${ASSESSMENT_URL}/assignment/${id}`,
                method: "GET",
            }),
            providesTags: ["Assignment", "Assessment"]
        }),
        createAssignmentScore: builder.mutation<AssgnmentScoreResponse, AssignmentScoreFromData>({
            query: (data) => ({
                url: `${ASSESSMENT_URL}/score`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Score', 'Assignment']
        }),

        getAssessmentLogByCandidateId: builder.query<AssessmentLogResponse, string>({
            query: (id) => ({
                url: `${ASSESSMENT_URL}/logs/candidate/${id}`,
                method: "GET",
            }),
            providesTags: ['Assessment', 'Assignment']
        })
    }),
});

export const {
    useCreateAssessmentMutation,
    useGetAssessmentQuery,
    useCreateAssignAssessmentMutation,
    useGetAssignedAssessmentQuery,
    useDeleteAssessmentMutation,
    useDeleteAssignmentMutation,
    useUpdateAssessmentMutation,
    useUpdateAssignmnetMutation,
    useGetAssessmentByIdQuery,
    useGetAssignmentByIdQuery,
    useGetAssignmentByCandidateQuery,
    useCreateAssignmentScoreMutation,
    useGetAssessmentLogByCandidateIdQuery
} = assessmentServiceApi;