import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { candidateData } from "../types";

interface candidateState {
    canditate: candidateData[];
}

const initialState: candidateState = {
    canditate: [],
};

const candidateSlice = createSlice({
    name: "candidate",
    initialState,
    reducers: {
        setCandidate: (state, action: PayloadAction<candidateData[]>) => {
            state.canditate = action.payload;
        },
    },
});

export const { setCandidate } = candidateSlice.actions;

export default candidateSlice.reducer;