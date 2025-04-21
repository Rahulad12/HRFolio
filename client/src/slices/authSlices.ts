import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { user } from "../types";

interface userResponse {
    user: user;
    success: boolean;
    message: string;
}

const token = localStorage.getItem("token") ? localStorage.getItem("token") : ""
const username = localStorage.getItem("username") ? localStorage.getItem("username") : ""
const email = localStorage.getItem("email") ? localStorage.getItem("email") : ""
const picture = localStorage.getItem("picture") ? localStorage.getItem("picture") : ""
const Id = localStorage.getItem("Id") ? localStorage.getItem("Id") : ""

const initialState: userResponse = {
    user: {
        username: username || "",
        email: email || "",
        token: token || "",
        picture: picture || "",
        loggedIn: false,
        Id: Id || ""
    },
    success: false,
    message: ""
};

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<userResponse>) => {
            state.user = action.payload.user;
            state.success = action.payload.success;
            state.message = action.payload.message

            const { username, email, token, picture, loggedIn, Id } = action.payload.user;

            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("email", email);
            localStorage.setItem("picture", picture || "");
            localStorage.setItem("googleLogin", loggedIn ? "true" : "false");
            localStorage.setItem("Id", Id);
        },
        logout: (state) => {
            state.user = {
                username: username || "",
                email: "",
                token: "",
                picture: "",
                loggedIn: false,
                Id: Id || ""
            };
            state.success = false;
            state.message = ""
            localStorage.removeItem("token");
        }
    }
});

export const { setCredentials, logout } = auth.actions;

export default auth.reducer;
