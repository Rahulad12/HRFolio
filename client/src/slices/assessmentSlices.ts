import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssessmentDataResponse, AssignmentDataResponse } from "../types";


interface assessmentState {
    assessments: AssessmentDataResponse[];
    assignedAssessments: AssignmentDataResponse[];
}

const initialState: assessmentState = {
    assessments: [],
    assignedAssessments: [],
}

export const assessmentSlice = createSlice({
    name: "assessments",
    initialState,
    reducers: {
        setAssessments: (state, action: PayloadAction<AssessmentDataResponse[]>) => {
            state.assessments = action.payload;
        },
        setAssignedAssessments: (state, action: PayloadAction<AssignmentDataResponse[]>) => {
            state.assignedAssessments = action.payload;
        },
    }
})

export const { setAssessments, setAssignedAssessments } = assessmentSlice.actions;

export default assessmentSlice.reducer;