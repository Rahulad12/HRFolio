import { api } from './api.ts'
import { activityLogResponse } from "../types/index.ts"
export const activityLogServiceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getActivityLogs: builder.query<activityLogResponse, void>({
            query: () => ({
                url: '/activity-log',
                method: 'GET',
            }),
            providesTags: ['ActivityLog', 'Interview', 'Candidate', 'Assessment', 'OfferLetter'],
        }),
    }),
})

export const { useGetActivityLogsQuery } = activityLogServiceApi;