import { Input, Select } from "antd";
import { useState } from "react";
import { useAppDispatch } from "../../Hooks/hook";
import { Search } from "lucide-react";
import ExportButton from "./Export";
import { useCandidate } from "../../action/StoreCandidate";
import { setCandidateSearch } from "../../slices/setSearchSlices";


interface StatusOption {
    label: string;
    value: string;
}

interface TableSearchProps {
    items?: StatusOption[];
    placeholder?: string;

}

const CandidateTableSearch = ({
    items = [],
    placeholder = "Search",


}: TableSearchProps) => {
    const dispatch = useAppDispatch();

    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const { data: candidates } = useCandidate();

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        dispatch(setCandidateSearch({ text: searchText, status: value }));
        if (value === "") {
            dispatch(setCandidateSearch({ text: searchText, status: "" }));
        }
    };

    const handleInputChange = (value: string) => {
        setSearchText(value);
        dispatch(setCandidateSearch({
            text: value,
            status: selectedStatus
        }));
        if (value === "") {
            dispatch(setCandidateSearch({ text: "", status: selectedStatus }));
        }
    };

    return (
        <div className="flex flex-wrap gap-4  items-center p-2  w-full ">
            <div className="flex items-center gap-2 w-full md:w-1/2 ">
                <Input
                    placeholder={placeholder}
                    allowClear
                    value={searchText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    prefix={<Search size={16} className="text-gray-500" />}
                />
            </div>

            <Select
                allowClear
                value={selectedStatus}
                onChange={handleStatusChange}
                placeholder="Filter by status"
                options={items}
                className="w-50"
                showSearch
            />

            <ExportButton data={candidates?.data} fileName="Candidates" />

        </div >
    );
};

export default CandidateTableSearch;
