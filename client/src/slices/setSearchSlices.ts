import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Dayjs } from "dayjs";
import { setCandidate } from "./candidateSlices";

interface candidatesearchTerms {
    text: string;
    status: string;
}
interface interviewsearchTerms {
    text: string;
    date: Dayjs | null;
    interviewStatus: string;
}
interface searchState {
    candidateSearch: candidatesearchTerms;
    interviews: interviewsearchTerms;
}
const initialState: searchState = {
    candidateSearch: {
        text: "",
        status: "",
    },
    interviews: {
        text: "",
        date: null,
        interviewStatus: "",
    },
}

const setSearchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        setCandidateSearch: (state, action: PayloadAction<candidatesearchTerms>) => {
            state.candidateSearch.text = action.payload.text;
            state.candidateSearch.status = action.payload.status;
            console.log("state.candidateSearch", state.candidateSearch);
            console.log("action.payload", action.payload);
        },
        setInterviewSearch: (state, action: PayloadAction<interviewsearchTerms>) => {
            state.interviews.text = action.payload.text;
            state.interviews.date = action.payload.date;
            state.interviews.interviewStatus = action.payload.interviewStatus;
        }
    },
});

export const { setCandidateSearch, setInterviewSearch } = setSearchSlice.actions;

export default setSearchSlice.reducer;