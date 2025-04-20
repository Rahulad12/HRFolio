import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api.ts"
import authReducer from "./slices/authSlices.ts"
import candidateSliceReducer from "./slices/candidateSlices.ts"
import setSearchSlice from "./slices/setSearchSlices.ts"
import interviewSliceReducer from "./slices/interviewSlices.ts"
import assessmentSlice from "./slices/assessmentSlices.ts"
import buttonPropsSliceReducer from "./slices/ButtonPropsSlices.tsx"

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        candidate: candidateSliceReducer,
        search: setSearchSlice,
        interview: interviewSliceReducer,
        assessments: assessmentSlice,
        buttonProps: buttonPropsSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;