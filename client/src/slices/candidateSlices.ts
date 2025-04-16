import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { candidateData } from "../types";

interface candidateState {
    candidate: candidateData[];
}

const initialState: candidateState = {
    candidate: [],
};

const candidateSlice = createSlice({
    name: "candidate",
    initialState,
    reducers: {
        setCandidate: (state, action: PayloadAction<candidateData[]>) => {
            state.candidate = action.payload;
        },
    },
});

export const { setCandidate } = candidateSlice.actions;

export default candidateSlice.reducer;