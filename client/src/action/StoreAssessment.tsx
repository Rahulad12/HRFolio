import { AppDispatch } from "../store";

import { setAssessments, setAssignedAssessments } from "../slices/assessmentSlices";
import { assessmentResponseData, AssignmentDataResponse } from "../types";

export const storeAssessment = (assessment: assessmentResponseData[], assignedAssessment: AssignmentDataResponse[]) => (dispatch: AppDispatch) => {
    dispatch(setAssessments(assessment));
    dispatch(setAssignedAssessments(assignedAssessment));
};