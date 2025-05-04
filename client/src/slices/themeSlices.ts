import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
    mode: 'light' | 'dark';
}

const initialState: ThemeState = {
    mode: 'light' as 'light' | 'dark',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.mode = action.payload;
            localStorage.setItem('themeMode', action.payload);
        },

        toggleThemeMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', state.mode);
        },
    },
});

export const { setThemeMode, toggleThemeMode } = themeSlice.actions;
export default themeSlice.reducer;