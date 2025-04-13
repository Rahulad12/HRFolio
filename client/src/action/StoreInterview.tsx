import { AppDispatch } from "../store";
import { setInterviews } from "../slices/interviewSlices";
import { interviewData } from "../types";

export const storeInterview = (interviews: interviewData[]) => (dispatch: AppDispatch) => {
    dispatch(setInterviews(interviews));
};