import { AppDispatch } from "../store";
import { setInterviews } from "../slices/interviewSlices";
import { interviewData } from "../types";
import { useGetInterviewQuery } from "../services/interviewServiceApi";
import { useEffect } from "react";
import { useAppDispatch } from "../Hooks/hook";

export const storeInterview = (interviews: interviewData[]) => (dispatch: AppDispatch) => {
    dispatch(setInterviews(interviews));
};

export const useInterview = () => {
    const dispatch = useAppDispatch();

    const { data: interview, isLoading, isError } = useGetInterviewQuery(
        {
            date: "",
            status: ""
        },
        {
            refetchOnMountOrArgChange: false
        }
    );

    useEffect(() => {
        if (interview?.success && interview?.data) {
            dispatch(storeInterview(interview.data));
        }
    }, [interview, dispatch]);

    return { interview, isLoading, isError };
};