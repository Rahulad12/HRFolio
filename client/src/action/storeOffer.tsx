import { useAppDispatch } from "../Hooks/hook";
import { AppDispatch } from "../store";
import { useGetOfferLetterQuery } from "../services/offerService";
import { setOfferLetters } from "../slices/offerSlices";
import { offerLetter } from "../types";

export const storeOffer = (offer: offerLetter[]) => (dispatch: AppDispatch) => {

    dispatch(setOfferLetters(offer));
};

export const useOffer = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading: offerLoading, isError: offerError } = useGetOfferLetterQuery();
    if (data?.success && data?.data) {
        dispatch(storeOffer(data?.data));
    }
    const offers = data?.data
    return { offers, offerLoading, offerError };
}