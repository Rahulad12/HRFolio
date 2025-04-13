import { setCandidate } from "../slices/candidateSlices";
import { AppDispatch } from "../store";
import { candidateData } from "../types";


export const storeCandidate = (candidate: candidateData[]) => (dispatch: AppDispatch) => {
    dispatch(setCandidate(candidate));
}