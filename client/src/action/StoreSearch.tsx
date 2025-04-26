import { AppDispatch } from "../store";
import { setCandidateSearch, setInterviewSearch } from "../slices/setSearchSlices";
import type { Dayjs } from 'dayjs';

export const storeSearch = (searchText: string, status: string, date: Dayjs | null, interviewStatus: string) => (dispatch: AppDispatch) => {

    if (searchText !== "" || status !== "") {
        dispatch(setCandidateSearch({ text: searchText, status }));
    }
    else {
        dispatch(setCandidateSearch({ text: "", status: "" }));
    }
    if (date) {
        dispatch(setInterviewSearch({ text: searchText, date, interviewStatus }));
    }
    else {
        dispatch(setInterviewSearch({ text: "", date: null, interviewStatus: "" }));
    }
}