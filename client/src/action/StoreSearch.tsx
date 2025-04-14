import { AppDispatch } from "../store";
import { setName, setTechnology, setStatus, setLevel, setDate, setInterviewStatus } from "../slices/setSearchSlices";
import type { Dayjs } from 'dayjs';

export const storeSearch = (name: string, technology: string, status: string, level: string, date: Dayjs | null, interviewStatus: string) => (dispatch: AppDispatch) => {
    dispatch(setName(name));
    dispatch(setTechnology(technology));
    dispatch(setStatus(status));
    dispatch(setLevel(level));
    dispatch(setDate(date));
    dispatch(setInterviewStatus(interviewStatus));
}