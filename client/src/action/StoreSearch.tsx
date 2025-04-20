import { AppDispatch } from "../store";
import { setText, setStatus, setDate, setInterviewStatus } from "../slices/setSearchSlices";
import type { Dayjs } from 'dayjs';

export const storeSearch = (searchText: string, status: string, date: Dayjs | null, interviewStatus: string) => (dispatch: AppDispatch) => {
    console.log(searchText, status, date, interviewStatus);
    if (searchText) {
        dispatch(setText(searchText));
    }
    else {
        dispatch(setText(''));
    }
    dispatch(setStatus(status));
    dispatch(setDate(date));
    dispatch(setInterviewStatus(interviewStatus));
}