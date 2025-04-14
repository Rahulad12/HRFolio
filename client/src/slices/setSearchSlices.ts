import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

interface searchState {
    name: string;
    technology: string;
    status: string;
    level: string;
    date: Dayjs | null;
    interviewStatus: string;
}
const todayDate = dayjs().format("YYYY-MM-DD");
console.log(todayDate);
const initialState: searchState = {
    name: "",
    technology: "",
    status: "",
    level: "",
    date: dayjs(todayDate),
    interviewStatus: ""
}

const setSearchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setTechnology: (state, action: PayloadAction<string>) => {
            state.technology = action.payload;
        },
        setStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
        setLevel: (state, action: PayloadAction<string>) => {
            state.level = action.payload;
        },
        setDate: (state, action: PayloadAction<Dayjs | null>) => {
            state.date = action.payload;
        },
        setInterviewStatus: (state, action: PayloadAction<string>) => {
            state.interviewStatus = action.payload;
        },

    },
});

export const { setName, setTechnology, setStatus, setLevel, setDate, setInterviewStatus } = setSearchSlice.actions;

export default setSearchSlice.reducer;