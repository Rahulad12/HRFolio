import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { interviewData } from "../types";
interface interviewState {
    interviews: interviewData[]; // Change this line
}

const initialState: interviewState = {
    interviews: [], // Start with an empty array
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