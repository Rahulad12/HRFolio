import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { assessmentResponseData, AssignmentData, AssignmentDataResponse } from "../types";

interface assessmentState {
    success: boolean;
    message: string;
    assessments: assessmentResponseData[];
    assignedAssessments: AssignmentDataResponse[];
}

const initialState: assessmentState = {
    success: false,
    message: "",
    assessments: [],
    assignedAssessments: [],
}

export const assessmentSlice = createSlice({
    name: "assessments",
    initialState,
    reducers: {
        setAssessments: (state, action: PayloadAction<assessmentResponseData[]>) => {
            state.assessments = action.payload;
        },
        setAssignedAssessments: (state, action: PayloadAction<AssignmentDataResponse[]>) => {
            state.assignedAssessments = action.payload;
        },
    }
})

export const { setAssessments, setAssignedAssessments } = assessmentSlice.actions;

export default assessmentSlice.reducer;