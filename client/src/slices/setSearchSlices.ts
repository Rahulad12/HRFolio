import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface searchState {
    name: string;
    technology: string;
    status: string;
    level: string;
}

const initialState: searchState = {
    name: "",
    technology: "",
    status: "",
    level: "",
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

    },
});

export const { setName, setTechnology, setStatus, setLevel } = setSearchSlice.actions;

export default setSearchSlice.reducer;