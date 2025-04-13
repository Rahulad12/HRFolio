import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { interviewData, interviewResponse } from "../types";

interface interviewState {
    interviews: interviewData[];
}

const initialState: interviewState = {
    interviews: [],
};


const interviewSlice = createSlice({
    name: "interviews",
    initialState,
    reducers: {
        setInterviews: (state, action: PayloadAction<interviewData[]>) => {
            state.interviews = action.payload;
        }
    }
});

export const { setInterviews } = interviewSlice.actions;

export default interviewSlice.reducer;