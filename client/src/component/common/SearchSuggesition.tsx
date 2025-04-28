import { Card } from "antd";
import { useAppSelector } from "../../Hooks/hook";
import { useGetSearchTermsQuery } from "../../services/searchService"
import { useNavigate } from "react-router-dom";

interface Props {
    className: any
}
const SearchSuggesition = ({ className }: Props) => {
    const navigate = useNavigate();
    const searchTerms = useAppSelector((state) => state.searchTerms.text)
    const { data: searchData, isLoading } = useGetSearchTermsQuery(searchTerms);
    return (
        <div className={`${className} overflow-auto`}>
            <Card loading={isLoading}>
                {
                    searchData?.slice(0.5)?.map((c) => (
                        <li key={c._id} onClick={() => navigate(`/dashboard/candidates/${c._id}`)} className="cursor-pointer flex gap-1">
                            <span className="capitalize text-blue-950 font-semibold"> {c.name}</span>
                            <span>-</span>
                            <span>{c?.technology}</span>
                            <span >({c?.level})</span>
                        </li>
                    ))
                }
            </Card>
        </div>
    )
}

export default SearchSuggesition
