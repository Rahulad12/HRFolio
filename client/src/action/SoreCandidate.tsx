import { useEffect } from "react";
import { useAppDispatch } from "../Hooks/hook";
import { useGetCandidateQuery } from "../services/candidateServiceApi";
import { setCandidate } from "../slices/candidateSlices";
import { AppDispatch } from "../store";
import { candidateData } from "../types";

export const storeCandidate = (candidate: candidateData[]) => (dispatch: AppDispatch) => {
    dispatch(setCandidate(candidate));
}

export const getCandidate = () => {
    const dispatch = useAppDispatch();
    const { data, isSuccess } = useGetCandidateQuery({
        name: "",
        technology: "",
        status: "",
        level: ""
    },
        {
            refetchOnMountOrArgChange: false
        }
    );

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(storeCandidate(data.data));
        }
        return () => {
            dispatch(storeCandidate([]));
        };
    }, [data]);
}