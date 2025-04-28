import { createSlice } from "@reduxjs/toolkit";

interface SideBarCollapsedState {
    collapse: boolean;
}

const initialState: SideBarCollapsedState = {
    collapse: false,
};

export const sideBarCollapsedSlice = createSlice({
    name: "sideBarCollapsed",
    initialState,
    reducers: {
        toggleSideBarCollapsed: (state) => {
            state.collapse = !state.collapse;
        },
    },
});

export const { toggleSideBarCollapsed } = sideBarCollapsedSlice.actions;

export default sideBarCollapsedSlice.reducer;