import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface candidatesearchTerms {
    text: string;
    status: string;
}
interface searchState {
    candidateSearch: candidatesearchTerms;
}
const initialState: searchState = {
    candidateSearch: {
        text: "",
        status: "",
    },

}
const setSearchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        setCandidateSearch: (state, action: PayloadAction<candidatesearchTerms>) => {
            state.candidateSearch.text = action.payload.text;
            state.candidateSearch.status = action.payload.status;
        },
    },
});

export const { setCandidateSearch } = setSearchSlice.actions;

export default setSearchSlice.reducer;