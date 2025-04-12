import { AppDispatch } from "../store";
import { setName, setTechnology, setStatus, setLevel } from "../slices/setSearchSlices";

export const storeSearch = (name: string, technology: string, status: string, level: string) => (dispatch: AppDispatch) => {
    dispatch(setName(name));
    dispatch(setTechnology(technology));
    dispatch(setStatus(status));
    dispatch(setLevel(level));
}