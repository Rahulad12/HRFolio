import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchTerms {
    text: string
}
const initialState: SearchTerms = {
    text: ""
}

const SearchTermsSlices = createSlice({
    name: "searchTerms",
    initialState,
    reducers: {
        setSearchTerms: (state, action: PayloadAction<SearchTerms>) => {
            state.text = action.payload.text;
        },
    }
})

export const { setSearchTerms } = SearchTermsSlices.actions;
export default SearchTermsSlices.reducer;
