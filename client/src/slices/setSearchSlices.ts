import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Dayjs } from "dayjs";

interface searchState {
    text: string;
    status: string;
    date: Dayjs | null;
    interviewStatus: string;
}
const initialState: searchState = {
    text: "",
    status: "",
    date: null,
    interviewStatus: ""
}

const setSearchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        setText: (state, action: PayloadAction<string>) => { state.text = action.payload },

        setStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },

        setDate: (state, action: PayloadAction<Dayjs | null>) => {
            state.date = action.payload;
        },
        setInterviewStatus: (state, action: PayloadAction<string>) => {
            state.interviewStatus = action.payload;
        },

    },
});

export const { setText, setStatus, setDate, setInterviewStatus } = setSearchSlice.actions;

export default setSearchSlice.reducer;