import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { offerLetter, offerLetterResponse } from "../types";

interface offerState {
    offerLetters: offerLetter[];
    offerLettersResponse: offerLetterResponse;
}

const initialState: offerState = {
    offerLetters: [],
    offerLettersResponse: {
        success: false,
        message: "",
        data: [],
    },
};

const offerSlice = createSlice({
    name: "offer",
    initialState,
    reducers: {
        setOfferLetters: (state, action: PayloadAction<offerLetter[]>) => {
            state.offerLetters = action.payload;
        },
        setOfferLettersResponse: (
            state,
            action: PayloadAction<offerLetterResponse>
        ) => {
            state.offerLettersResponse = action.payload;
        },
    },
});

export const { setOfferLetters, setOfferLettersResponse } = offerSlice.actions;
export default offerSlice.reducer;
