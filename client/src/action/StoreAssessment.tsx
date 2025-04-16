import { AppDispatch } from "../store";

import { setAssessments, setAssignedAssessments } from "../slices/assessmentSlices";
import { AssessmentDataResponse, AssignmentDataResponse } from "../types";

export const storeAssessment = (assessment: AssessmentDataResponse[]) => (dispatch: AppDispatch) => {
    dispatch(setAssessments(assessment));
};

export const storeAssignedAssessment = (assignedAssessment: AssignmentDataResponse[]) => (dispatch: AppDispatch) => {
    dispatch(setAssignedAssessments(assignedAssessment));
};