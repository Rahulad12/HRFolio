import { AppDispatch } from "../store";
import { setInterviewer, setInterviews } from "../slices/interviewSlices";
import { interviewData, interviewer } from "../types";
import { useGetInterviewerQuery, useGetInterviewQuery } from "../services/interviewServiceApi";
import { useEffect } from "react";
import { useAppDispatch } from "../Hooks/hook";
import { Dayjs } from "dayjs";
export const storeInterview = (interviews: interviewData[]) => (dispatch: AppDispatch) => {
    console.log(interviews, "interviews data");
    dispatch(setInterviews(interviews));
};

export const storeInterviewer = (interviewer: interviewer[]) => (dispatch: AppDispatch) => {
    dispatch(setInterviewer(interviewer));
};

export const useInterview = (status: string | null, date: Dayjs | null) => {
    const dispatch = useAppDispatch();

    const { data: interview, isLoading, isError } = useGetInterviewQuery(
        {
            date: date?.format("YYYY-MM-DD") || "",
            status: status || ""
        },
        {
            refetchOnMountOrArgChange: false
        }
    );
    useEffect(() => {
        if (interview?.success && interview?.data) {
            const interviewList = Array.isArray(interview.data) ? interview.data : [interview.data];
            dispatch(storeInterview(interviewList));
        }
    }, [interview, dispatch]);

    return { interview, isLoading, isError };
};

export const useInterviewer = () => {
    const dispatch = useAppDispatch();
    const { data: interviewers, isLoading: interviewerLoading, isError: interviewerError } = useGetInterviewerQuery();

    if (interviewers?.success && interviewers?.data) {
        dispatch(storeInterviewer(interviewers.data));
    }
    return { interviewers, interviewerLoading, interviewerError };
}