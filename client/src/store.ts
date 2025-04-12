import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api.ts"
import authReducer from "./slices/authSlices.ts"
import candidateSliceReducer from "./slices/candidateSlices.ts"

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        candidate: candidateSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;