import { api } from "./api";
import { UploadFileResponse, UploadFileRequest } from "../types/index"

export const uploadFileServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        uploadResume: builder.mutation<UploadFileResponse, any>({
            query: (data) => ({
                url: '/uploads/resume',
                method: 'POST',
                body: data,
            }),
        }),
        downloadResume: builder.query<any, string>({
            query: (filename) => ({
                url: `/uploads/resume/${filename}`,
                method: 'GET',
            }),
        })
    }),
});

export const { useUploadResumeMutation, useDownloadResumeQuery } = uploadFileServiceApi;
