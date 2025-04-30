import { EMAIL_TEMPLATE_URL } from "../constant";
import { emailTemplateData, emailTemplateResponse, emailTemplateResponseById, generalEmailFormData, generalEmailResponse } from "../types";
import { api } from "./api";

const emailServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllEmailTemplate: builder.query<emailTemplateResponse, void>({
            query: () => ({
                url: `${EMAIL_TEMPLATE_URL}`,
                method: 'GET'
            }),
            providesTags: ['EmailTemplate']
        }),

        getEmailTemplateById: builder.query<emailTemplateResponseById, string>({
            query: (id) => ({
                url: `${EMAIL_TEMPLATE_URL}/${id}`,
                method: 'GET'
            }),
            providesTags: ['EmailTemplate']
        }),

        createEmailTemplate: builder.mutation<emailTemplateResponse, emailTemplateData>({
            query: (data) => ({
                url: `${EMAIL_TEMPLATE_URL}`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['EmailTemplate']
        }),
        updateEmailTemplate: builder.mutation<emailTemplateResponseById, { id: string, data: emailTemplateData }>({
            query: ({ id, data }) => ({
                url: `${EMAIL_TEMPLATE_URL}/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['EmailTemplate']
        }),
        deleteEmailTemplate: builder.mutation<emailTemplateResponse, string>({
            query: (id) => ({
                url: `${EMAIL_TEMPLATE_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EmailTemplate']

        }),
        createGeneralEmail: builder.mutation<generalEmailResponse, generalEmailFormData>({
            query: (data) => ({
                url: `${EMAIL_TEMPLATE_URL}/general/send`,
                method: 'POST',
                body: data
            }),
        })
    })
})

export const { useGetAllEmailTemplateQuery, useGetEmailTemplateByIdQuery, useCreateEmailTemplateMutation, useUpdateEmailTemplateMutation, useDeleteEmailTemplateMutation, useCreateGeneralEmailMutation } = emailServiceApi