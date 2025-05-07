import { AppDispatch } from "../store";

import { setAssessments, setAssignedAssessments } from "../slices/assessmentSlices";
import { AssessmentDataResponse, AssignmentDataResponse } from "../types";
import { useGetAssessmentQuery, useGetAssignedAssessmentQuery } from "../services/assessmentServiceApi";
import { useAppDispatch } from "../Hooks/hook";
import { useEffect } from "react";

export const storeAssessment = (assessment: AssessmentDataResponse[]) => (dispatch: AppDispatch) => {
    dispatch(setAssessments(assessment));
};

export const storeAssignedAssessment = (assignedAssessment: AssignmentDataResponse[]) => (dispatch: AppDispatch) => {
    dispatch(setAssignedAssessments(assignedAssessment));
};


export const useAssessment = () => {
    const dispatch = useAppDispatch();

    const { data: assessment, isLoading: assessmentLoading, isError: assessmentError, refetch } = useGetAssessmentQuery();
    useEffect(() => {
        if (assessment?.success && assessment?.data) {
            dispatch(storeAssessment(assessment.data));
        }
    }, [assessment, dispatch]);

    return { assessment, assessmentLoading, assessmentError, refetch };

}

export const useAssignedAssessment = () => {
    const dispatch = useAppDispatch();

    const { data: assignedAssessment, isLoading:assignmentLoading, isError } = useGetAssignedAssessmentQuery();

    useEffect(() => {
        if (assignedAssessment?.success && assignedAssessment?.data) {
            dispatch(storeAssignedAssessment(assignedAssessment.data));
        }
    }, [assignedAssessment, dispatch]);

    return { assignedAssessment, assignmentLoading, isError };
}