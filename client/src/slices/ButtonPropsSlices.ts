import { createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";
interface buttonState {
    text: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
}
const initialState: buttonState = {
    text: "",
    icon: undefined,
    onClick: undefined,
    disabled: false,
    loading: false

};

const buttonPropsSlice = createSlice({
    name: "buttonProps",
    initialState,
    reducers: {
        buttonState: (state, action) => {
            state.text = action.payload.text;
            state.icon = action.payload.icon;
            state.onClick = action.payload.onClick;
            state.disabled = action.payload.disabled;
            state.loading = action.payload.loading;
        },
    },
});

export const { buttonState } = buttonPropsSlice.actions;
export default buttonPropsSlice.reducer;
