import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { interviewData, interviewerData } from "../types";
interface interviewState {
    interviews: interviewData[];
    interviewer: interviewerData[];
}

const initialState: interviewState = {
    interviews: [], // Start with an empty array
    interviewer: []
};

const interviewSlice = createSlice({
    name: "interviews",
    initialState,
    reducers: {
        setInterviews: (state, action: PayloadAction<interviewData[]>) => {
            state.interviews = action.payload;
        },
        setInterviewer: (state, action: PayloadAction<interviewerData[]>) => {
            state.interviewer = action.payload;
        }
    }
});

export const { setInterviews, setInterviewer } = interviewSlice.actions;

export default interviewSlice.reducer;